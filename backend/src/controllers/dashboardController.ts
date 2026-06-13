import { Request, Response } from "express";
import { Auction } from "../models/Auction";
import { Item } from "../models/Item";
import { Transaction } from "../models/Transaction";
import { asyncHandler } from "../utils/asyncHandler";

export const getDashboard = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;

  const [items, activeAuctions, recentTransactions] = await Promise.all([
    Item.find({ ownerId: userId }),
    Auction.countDocuments({ sellerId: userId, status: "active" }),
    Transaction.find({
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("itemId", "name imageUrl")
      .sort({ createdAt: -1 })
      .limit(5),
  ]);

  const totalValue = items.reduce((sum, item) => sum + item.currentPrice, 0);

  res.json({
    success: true,
    data: {
      totalItems: items.length,
      totalValue,
      activeAuctions,
      recentTransactions,
    },
  });
});
