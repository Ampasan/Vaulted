import { Request, Response } from "express";
import { Item } from "../models/Item";
import { Wishlist } from "../models/Wishlist";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { addWishlistSchema } from "../validations/transactionValidation";

export const getWishlist = asyncHandler(async (req: Request, res: Response) => {
  const wishlist = await Wishlist.find({ userId: req.user!.id })
    .populate({
      path: "itemId",
      populate: { path: "ownerId", select: "name email" },
    })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    data: wishlist,
  });
});

export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
  const data = addWishlistSchema.parse(req.body);

  const item = await Item.findById(data.itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  const existing = await Wishlist.findOne({
    userId: req.user!.id,
    itemId: data.itemId,
  });

  if (existing) {
    throw new ApiError(409, "Item already in wishlist");
  }

  const wishlistItem = await Wishlist.create({
    userId: req.user!.id,
    itemId: data.itemId,
  });

  const populated = await Wishlist.findById(wishlistItem._id).populate("itemId");

  res.status(201).json({
    success: true,
    data: populated,
    message: "Added to wishlist",
  });
});

export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
  const result = await Wishlist.findOneAndDelete({
    userId: req.user!.id,
    itemId: req.params.itemId,
  });

  if (!result) {
    throw new ApiError(404, "Wishlist item not found");
  }

  res.json({
    success: true,
    message: "Removed from wishlist",
  });
});
