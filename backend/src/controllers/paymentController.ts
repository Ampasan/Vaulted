import { Request, Response } from "express";
import mongoose from "mongoose";
import axios from "axios";
import { Item } from "../models/Item";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { createNotification } from "../services/notificationService";
import { getUserTierDetails, assertBuyerTierAccess } from "../services/userService";

const XENDIT_SECRET_KEY = process.env.XENDIT_SECRET_KEY || "";
const XENDIT_WEBHOOK_TOKEN = process.env.XENDIT_WEBHOOK_TOKEN || "";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";


export const createVirtualAccount = asyncHandler(async (req: Request, res: Response) => {
  console.log("=== createVirtualAccount endpoint called ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const { itemId, bankCode } = req.body;

  if (!itemId || !bankCode) {
    throw new ApiError(400, "itemId and bankCode are required");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.status !== "listed_marketplace") {
    throw new ApiError(400, "Item is not available for purchase");
  }

  if (item.ownerId.toString() === req.user!.id) {
    throw new ApiError(400, "You cannot buy your own item");
  }

  const buyer = await User.findById(req.user!.id);
  const seller = await User.findById(item.ownerId);

  if (!buyer || !seller) {
    throw new ApiError(404, "Buyer or Seller not found");
  }

  const buyerTierDetails = await getUserTierDetails(buyer._id);
  if (!buyerTierDetails) {
    throw new ApiError(404, "Buyer not found");
  }

  assertBuyerTierAccess(buyerTierDetails.tier, item);

  const transaction = await Transaction.create({
    buyerId: buyer._id,
    sellerId: seller._id,
    itemId: item._id,
    amount: item.currentPrice,
    type: "marketplace_purchase",
    status: "pending",
    metadata: {
      paymentMethod: "VIRTUAL_ACCOUNT",
      bankCode: bankCode
    }
  });

  item.status = "pending_settlement";
  await item.save();

  console.log(`Transaction created: ${transaction._id}`);

  try {
    const xenditPayload: any = {
      reference_id: transaction._id.toString(),
      type: "PAY",
      country: "ID",
      currency: "IDR",
      request_amount: item.currentPrice,
      capture_method: "AUTOMATIC",
      channel_code: bankCode,
      channel_properties: {
        customer_name: buyer.name || "Customer",
        display_name: buyer.name || "Customer"
      },
      customer: {
        reference_id: buyer._id.toString(),
        type: "INDIVIDUAL",
        email: buyer.email,
        mobile_number: buyer.phoneNumber || undefined,
        individual_detail: {
          given_names: buyer.name?.split(" ")[0] || "Customer",
          surname: buyer.name?.split(" ").slice(1).join(" ") || "Name",
        },
      },
      description: `Payment for ${item.name}`,
      metadata: {
        itemId: item._id.toString(),
        transactionId: transaction._id.toString(),
        paymentMethod: "VIRTUAL_ACCOUNT"
      },
    };

    console.log("Xendit VA payload (v3):", JSON.stringify(xenditPayload, null, 2));

    const response = await axios.post(
      "https://api.xendit.co/v3/payment_requests",
      xenditPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "API-VERSION": "2024-11-11",
          Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
        },
        timeout: 30000,
      }
    );

    console.log("Xendit VA response (v3):", JSON.stringify(response.data, null, 2));

    const paymentData = response.data;

    let vaNumber = paymentData.channel_properties?.virtual_account_number;

    if (!vaNumber && paymentData.actions && paymentData.actions.length > 0) {
      const vaAction = paymentData.actions.find((a: any) => a.action_type === "VIRTUAL_ACCOUNT" || a.action_type === "DISPLAY_VIRTUAL_ACCOUNT");
      if (vaAction && vaAction.virtual_account_number) {
        vaNumber = vaAction.virtual_account_number;
      }
    }

    transaction.metadata = {
      ...transaction.metadata,
      paymentRequestId: paymentData.id,
      accountNumber: vaNumber,
      bankCode: paymentData.channel_code || bankCode,
      expectedAmount: paymentData.request_amount || item.currentPrice,
    };
    await transaction.save();

    res.json({
      success: true,
      status: "pending",
      transaction,
      virtualAccount: {
        bankCode: paymentData.channel_code || bankCode,
        accountNumber: vaNumber,
        name: paymentData.channel_properties?.customer_name || buyer.name,
        expectedAmount: paymentData.request_amount || item.currentPrice,
      },
      message: "Virtual Account created successfully",
    });

  } catch (error: any) {
    console.error("Xendit VA creation error:");
    if (error.response) {
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    } else {
      console.error("Error message:", error.message);
    }

    if (transaction && transaction.status === "pending") {
      transaction.status = "failed";
      await transaction.save();
      
      item.status = "listed_marketplace";
      await item.save();
    }

    let errorMessage = "Failed to create virtual account";
    let statusCode = 500;

    if (error.response?.data) {
      errorMessage = error.response.data.message || errorMessage;
      statusCode = error.response.status || 500;
    }

    throw new ApiError(statusCode, errorMessage);
  }
});

export const chargeCard = asyncHandler(async (req: Request, res: Response) => {
  console.log("=== chargeCard endpoint called (V3 Direct Card) ===");
  console.log("Request body:", JSON.stringify(req.body, null, 2));

  const {
    cardNumber,
    expiryMonth,
    expiryYear,
    cvv,
    cardholderName,
    cardholderEmail,
    tokenId,
    itemId,
    saveCard,
    successReturnUrl,
    failureReturnUrl,
  } = req.body;

  if (!itemId) {
    console.error("Missing itemId!");
    throw new ApiError(400, "itemId is required");
  }

  const item = await Item.findById(itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.status !== "listed_marketplace") {
    throw new ApiError(400, "Item is not available for purchase");
  }

  if (item.ownerId.toString() === req.user!.id) {
    throw new ApiError(400, "You cannot buy your own item");
  }

  const buyer = await User.findById(req.user!.id);
  const seller = await User.findById(item.ownerId);

  if (!buyer || !seller) {
    throw new ApiError(404, "Buyer or Seller not found");
  }

  const buyerTierDetails = await getUserTierDetails(buyer._id);
  if (!buyerTierDetails) {
    throw new ApiError(404, "Buyer not found");
  }

  assertBuyerTierAccess(buyerTierDetails.tier, item);

  const transaction = await Transaction.create({
    buyerId: buyer._id,
    sellerId: seller._id,
    itemId: item._id,
    amount: item.currentPrice,
    type: "marketplace_purchase",
    status: "pending",
    metadata: {
      saveCard,
      cardNumber: cardNumber ? cardNumber.slice(-4) : "0000",
      expiryMonth,
      expiryYear
    }
  });

  item.status = "pending_settlement";
  await item.save();

  console.log(`Transaction created: ${transaction._id}`);

  try {
    const xenditPayload: any = {
      reference_id: transaction._id.toString(),
      type: "PAY",
      country: "ID",
      currency: "IDR",
      request_amount: item.currentPrice,
      capture_method: "AUTOMATIC",
      channel_code: "CARDS",
      channel_properties: {
        success_return_url: successReturnUrl || `${CLIENT_URL}/portfolio`,
        failure_return_url: failureReturnUrl || `${CLIENT_URL}/settlement?error=true`,
        statement_descriptor: "Vaulted Auction",
      },
      customer: {
        reference_id: buyer._id.toString(),
        type: "INDIVIDUAL",
        email: buyer.email,
        mobile_number: buyer.phoneNumber || undefined,
        individual_detail: {
          given_names: buyer.name?.split(" ")[0] || "Customer",
          surname: buyer.name?.split(" ").slice(1).join(" ") || "Name",
        },
      },
      description: `Payment for ${item.name}`,
      metadata: {
        itemId: item._id.toString(),
        transactionId: transaction._id.toString(),
      },
    };

    if (cardNumber) {
      const nameParts = cardholderName?.trim().split(" ") || ["Test", "User"];
      const firstName = nameParts[0] || "Customer";
      const lastName = nameParts.slice(1).join(" ") || "Name";

      xenditPayload.channel_properties.card_details = {
        card_number: cardNumber.replace(/\s/g, ""),
        expiry_month: expiryMonth,
        expiry_year: expiryYear,
        cvn: cvv?.trim(),
        cardholder_first_name: firstName,
        cardholder_last_name: lastName,
        cardholder_email: cardholderEmail || buyer.email,
      };
    }

    if (tokenId) {
      xenditPayload.channel_properties.payment_token_id = tokenId;
    }

    console.log("V3 Xendit payload:", JSON.stringify(xenditPayload, null, 2));

    const response = await axios.post(
      "https://api.xendit.co/v3/payment_requests",
      xenditPayload,
      {
        headers: {
          "Content-Type": "application/json",
          "API-VERSION": "2024-11-11",
          Authorization: `Basic ${Buffer.from(XENDIT_SECRET_KEY + ":").toString("base64")}`,
        },
        timeout: 30000,
      }
    );

    console.log("V3 Xendit response:", JSON.stringify(response.data, null, 2));

    const paymentRequest = response.data;

    if (paymentRequest.status === "SUCCEEDED" ||
      paymentRequest.status === "COMPLETED" ||
      paymentRequest.status === "CAPTURED") {

      console.log(`Payment successful! Status: ${paymentRequest.status}`);

      const paymentTokenId = paymentRequest.payment_token_id || paymentRequest.id;

      const session = await mongoose.startSession();
      session.startTransaction();
      try {
        const tBuyer = await User.findById(buyer._id).session(session);
        const tSeller = await User.findById(seller._id).session(session);
        const tItem = await Item.findById(item._id).session(session);
        const tTransaction = await Transaction.findById(transaction._id).session(session);

        if (tBuyer && tSeller && tItem && tTransaction) {
          tItem.ownerId = tBuyer._id;
          tItem.status = "owned";
          tItem.priceHistory.push({
            price: tItem.currentPrice,
            recordedAt: new Date(),
          });

          tSeller.balance = (tSeller.balance || 0) + tItem.currentPrice;
          tTransaction.status = "completed";

          await tBuyer.save({ session });
          await tSeller.save({ session });
          await tItem.save({ session });
          await tTransaction.save({ session });
        }
        await session.commitTransaction();

        await createNotification(
          buyer._id,
          "transaction_success",
          `You purchased ${item.name} for IDR ${item.currentPrice} via Card`,
          item._id
        );

        await createNotification(
          seller._id,
          "transaction_success",
          `Your item ${item.name} was sold for IDR ${item.currentPrice}`,
          item._id
        );

      } catch (err) {
        await session.abortTransaction();
        console.error("Transaction error:", err);
        throw err;
      } finally {
        session.endSession();
      }

      if (saveCard && paymentTokenId) {
        const alreadySaved = buyer.savedCards?.some((c) => c.tokenId === paymentTokenId);
        if (!alreadySaved) {
          buyer.savedCards = buyer.savedCards || [];
          buyer.savedCards.push({
            tokenId: paymentTokenId,
            maskedCardNumber: cardNumber ? `•••• •••• •••• ${cardNumber.slice(-4)}` : "•••• •••• •••• 0000",
            cardBrand: "VISA",
            expiryMonth: expiryMonth || "12",
            expiryYear: expiryYear || "2029",
          });
          await buyer.save();
        }
      }

      res.json({
        success: true,
        status: "completed",
        transaction,
        message: "Payment successfully captured and item transferred",
      });
      return;
    }

    if (paymentRequest.status === "REQUIRES_ACTION") {
      const redirectAction = paymentRequest.actions?.find(
        (a: any) => a.type === "REDIRECT_CUSTOMER"
      );

      transaction.metadata = {
        ...transaction.metadata,
        paymentRequestId: paymentRequest.payment_request_id || paymentRequest.id,
        paymentTokenId: paymentRequest.payment_token_id || paymentRequest.id,
        status: paymentRequest.status,
      };
      await transaction.save();

      res.json({
        success: true,
        status: "pending",
        transaction,
        actionUrl: redirectAction?.value || paymentRequest.actions?.[0]?.value,
        paymentRequestId: paymentRequest.payment_request_id,
        message: "Payment requires 3D Secure authentication. Redirecting...",
      });
      return;
    }

    if (paymentRequest.status === "PENDING") {
      transaction.metadata = {
        ...transaction.metadata,
        paymentRequestId: paymentRequest.payment_request_id || paymentRequest.id,
        paymentTokenId: paymentRequest.payment_token_id || paymentRequest.id,
        status: paymentRequest.status,
      };
      await transaction.save();

      res.json({
        success: true,
        status: "pending",
        transaction,
        paymentRequestId: paymentRequest.payment_request_id,
        message: "Payment is pending processing",
      });
      return;
    }

    if (paymentRequest.status === "FAILED") {
      transaction.status = "failed";
      await transaction.save();
      
      item.status = "listed_marketplace";
      await item.save();

      const errorMsg = paymentRequest.failure_reason || "Payment failed";
      console.log(`Payment failed: ${errorMsg}`);

      throw new ApiError(400, errorMsg);
    }

    console.log(`Unhandled status: ${paymentRequest.status}`);
    console.log("Full response:", JSON.stringify(paymentRequest, null, 2));

    transaction.status = "pending";
    await transaction.save();

    res.json({
      success: true,
      status: "pending",
      transaction,
      paymentRequestId: paymentRequest.payment_request_id,
      message: `Payment status: ${paymentRequest.status}`,
    });

  } catch (error: any) {
    console.error("Xendit charge error:");

    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response headers:", JSON.stringify(error.response.headers, null, 2));
      console.error("Response data:", JSON.stringify(error.response.data, null, 2));
    } else if (error.request) {
      console.error("No response received:", error.request);
    } else {
      console.error("Error message:", error.message);
    }
    console.error("Error stack:", error.stack);

    let errorMessage = "Failed to process card payment";
    let statusCode = 500;

    if (error.response?.data) {
      const errorData = error.response.data;

      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.error_code) {
        errorMessage = `${errorData.error_code}: ${errorData.error_message || errorData.message || "Unknown error"}`;
      } else if (errorData.errors) {
        const errorFields = Object.keys(errorData.errors);
        if (errorFields.length > 0) {
          const field = errorFields[0];
          errorMessage = `${field}: ${errorData.errors[field].join(", ")}`;
        }
      }

      statusCode = error.response.status || 500;
    }
    if (transaction && transaction.status === "pending") {
      transaction.status = "failed";
      await transaction.save();

      item.status = "listed_marketplace";
      await item.save();
    }

    throw new ApiError(statusCode, errorMessage);
  }
});

export const getSavedCards = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    data: user.savedCards || [],
  });
});

export const handleWebhook = asyncHandler(async (req: Request, res: Response) => {
  const webhookToken = req.headers["x-callback-token"];

  if (XENDIT_WEBHOOK_TOKEN && webhookToken !== XENDIT_WEBHOOK_TOKEN) {
    console.warn("Invalid webhook token received");
    res.status(401).json({ success: false, message: "Invalid webhook token" });
    return;
  }

  const payload = req.body;
  console.log("Received Xendit webhook payload:", JSON.stringify(payload, null, 2));

  const data = payload.data || payload;
  const isVirtualAccountPayment = !!data.callback_virtual_account_id;

  let paymentRequestId = null;
  let status = null;
  let transactionToProcess = null;

  if (isVirtualAccountPayment) {
    console.log("Processing Virtual Account Payment Webhook");
    transactionToProcess = await Transaction.findById(data.external_id);
    if (!transactionToProcess) {
      console.warn(`Transaction not found for VA external_id: ${data.external_id}`);
      res.json({ success: true, message: "Transaction not found" });
      return;
    }
    status = "COMPLETED";
  } else {
    paymentRequestId = data.payment_request_id || data.id;
    status = data.status || data.current_status;

    if (!paymentRequestId) {
      console.warn("No payment_request_id found in webhook payload");
      res.json({ success: true, message: "No payment request ID found" });
      return;
    }

    transactionToProcess = await Transaction.findOne({
      "metadata.paymentRequestId": paymentRequestId,
    });

    if (!transactionToProcess) {
      console.warn(`Transaction not found for payment request: ${paymentRequestId}`);
      res.json({ success: true, message: "Transaction not found" });
      return;
    }
  }

  if (transactionToProcess.status !== "pending") {
    console.log(`Transaction ${transactionToProcess._id} already processed (status: ${transactionToProcess.status})`);
    res.json({ success: true, message: "Transaction already processed" });
    return;
  }

  if (status === "SUCCEEDED" || status === "CAPTURED" || status === "COMPLETED") {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      const buyer = await User.findById(transactionToProcess.buyerId).session(session);
      const seller = await User.findById(transactionToProcess.sellerId).session(session);
      const item = await Item.findById(transactionToProcess.itemId).session(session);

      if (!buyer || !seller || !item) {
        throw new Error("Buyer, seller, or item not found during webhook processing");
      }

      console.log(`Webhook: Transferring item ${item._id} from ${seller._id} to ${buyer._id}`);

      item.ownerId = buyer._id;
      item.status = "owned";
      item.priceHistory.push({
        price: item.currentPrice,
        recordedAt: new Date(),
      });

      seller.balance = (seller.balance || 0) + item.currentPrice;
      transactionToProcess.status = "completed";

      await buyer.save({ session });
      await seller.save({ session });
      await item.save({ session });
      await transactionToProcess.save({ session });

      if (transactionToProcess.metadata?.saveCard) {
        const paymentTokenId = transactionToProcess.metadata?.paymentTokenId || transactionToProcess.metadata?.paymentRequestId;
        const alreadySaved = buyer.savedCards?.some((c: any) => c.tokenId === paymentTokenId);
        if (!alreadySaved && paymentTokenId) {
          buyer.savedCards = buyer.savedCards || [];
          buyer.savedCards.push({
            tokenId: paymentTokenId,
            maskedCardNumber: `•••• •••• •••• ${transactionToProcess.metadata.cardNumber || "0000"}`,
            cardBrand: "VISA",
            expiryMonth: transactionToProcess.metadata.expiryMonth || "12",
            expiryYear: transactionToProcess.metadata.expiryYear || "2029",
          });
          await buyer.save({ session });
        }
      }

      await session.commitTransaction();

      console.log(`Webhook: Transaction ${transactionToProcess._id} completed successfully`);

      const isVA = transactionToProcess.metadata?.paymentMethod === "VIRTUAL_ACCOUNT";
      const paymentMethodStr = isVA ? "Bank Transfer" : "Card";

      await createNotification(
        buyer._id,
        "transaction_success",
        `Your ${paymentMethodStr} payment was confirmed. You purchased ${item.name} for IDR ${item.currentPrice}`,
        item._id
      );

      await createNotification(
        seller._id,
        "transaction_success",
        `Your item ${item.name} was sold for IDR ${item.currentPrice}`,
        item._id
      );

    } catch (err) {
      await session.abortTransaction();
      console.error("Webhook processing error:", err);
      res.status(500).json({ success: false, message: "Internal server error during processing" });
      return;
    } finally {
      session.endSession();
    }
  }

  if (status === "FAILED" || status === "EXPIRED") {
    transactionToProcess.status = "failed";
    await transactionToProcess.save();

    const item = await Item.findById(transactionToProcess.itemId);
    if (item && item.status === "pending_settlement") {
      item.status = "listed_marketplace";
      await item.save();
    }

    console.log(`Webhook: Transaction ${transactionToProcess._id} failed`);

    const isVA = transactionToProcess.metadata?.paymentMethod === "VIRTUAL_ACCOUNT";
    const paymentMethodStr = isVA ? "Bank Transfer" : "Card";

    await createNotification(
      transactionToProcess.buyerId,
      "transaction_failed",
      `Your ${paymentMethodStr} payment for ${transactionToProcess._id} failed`,
      transactionToProcess.itemId
    );
  }

  res.json({ success: true });
});