import { Request, Response } from "express";
import { Transaction } from "../models/Transaction";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getTransactions = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await Transaction.find({
    $or: [{ buyerId: req.user!.id }, { sellerId: req.user!.id }],
  })
    .populate("buyerId", "name email")
    .populate("sellerId", "name email")
    .populate("itemId", "name imageUrl currentPrice")
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: transactions,
  });
});

export const getTransactionById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate("buyerId", "name email")
    .populate("sellerId", "name email")
    .populate("itemId");

  if (!transaction) {
    throw new ApiError(404, "Transaction not found");
  }

  const userId = req.user!.id;
  const isParticipant =
    transaction.buyerId._id.toString() === userId ||
    transaction.sellerId._id.toString() === userId;

  if (!isParticipant) {
    throw new ApiError(403, "Access denied");
  }

  res.json({
    success: true,
    data: transaction,
  });
});
