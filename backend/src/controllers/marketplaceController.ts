import mongoose from "mongoose";
import { Request, Response } from "express";
import { Item } from "../models/Item";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { listMarketplaceSchema } from "../validations/itemValidation";
import { createNotification } from "../services/notificationService";

export const getMarketplaceItems = asyncHandler(async (_req: Request, res: Response) => {
  const items = await Item.find({ status: "listed_marketplace" })
    .populate("ownerId", "name email")
    .sort({ updatedAt: -1 });

  res.json({
    success: true,
    data: items,
  });
});

export const listItemOnMarketplace = asyncHandler(async (req: Request, res: Response) => {
  const data = listMarketplaceSchema.parse(req.body);
  const item = await Item.findById(req.params.itemId);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user!.id) {
    throw new ApiError(403, "You can only list your own items");
  }

  if (item.status !== "owned") {
    throw new ApiError(400, "Item must be owned to list on marketplace");
  }

  item.currentPrice = data.price;
  item.status = "listed_marketplace";
  item.priceHistory.push({ price: data.price, recordedAt: new Date() });
  await item.save();

  res.json({
    success: true,
    data: item,
    message: "Item listed on marketplace",
  });
});

export const buyMarketplaceItem = asyncHandler(async (req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const item = await Item.findById(req.params.itemId).session(session);

    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    if (item.status !== "listed_marketplace") {
      throw new ApiError(400, "Item is not available for purchase");
    }

    if (item.ownerId.toString() === req.user!.id) {
      throw new ApiError(400, "You cannot buy your own item");
    }

    const buyer = await User.findById(req.user!.id).session(session);
    const seller = await User.findById(item.ownerId).session(session);

    if (!buyer || !seller) {
      throw new ApiError(404, "User not found");
    }

    if (buyer.balance < item.currentPrice) {
      throw new ApiError(400, "Insufficient balance");
    }

    buyer.balance -= item.currentPrice;
    seller.balance += item.currentPrice;

    item.ownerId = buyer._id;
    item.status = "owned";
    item.priceHistory.push({
      price: item.currentPrice,
      recordedAt: new Date(),
    });

    await buyer.save({ session });
    await seller.save({ session });
    await item.save({ session });

    const [transaction] = await Transaction.create(
      [
        {
          buyerId: buyer._id,
          sellerId: seller._id,
          itemId: item._id,
          amount: item.currentPrice,
          type: "marketplace_purchase",
          status: "completed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    await createNotification(
      buyer._id,
      "transaction_success",
      `You purchased ${item.name} for ${item.currentPrice}`,
      item._id
    );

    await createNotification(
      seller._id,
      "transaction_success",
      `Your item ${item.name} was sold for ${item.currentPrice}`,
      item._id
    );

    res.json({
      success: true,
      data: { item, transaction },
      message: "Purchase successful",
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
