import { Request, Response } from "express";
import { Auction } from "../models/Auction";
import { Item } from "../models/Item";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { createAuctionSchema, placeBidSchema } from "../validations/auctionValidation";
import { placeBidOnAuction } from "../services/auctionService";

export const getAuctions = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  } else {
    filter.status = "active";
  }

  const auctions = await Auction.find(filter)
    .populate("itemId")
    .populate("sellerId", "name email")
    .populate("highestBidderId", "name email")
    .sort({ endTime: 1 });

  res.json({
    success: true,
    data: auctions,
  });
});

export const getAuctionById = asyncHandler(async (req: Request, res: Response) => {
  const auction = await Auction.findById(req.params.id)
    .populate("itemId")
    .populate("sellerId", "name email")
    .populate("highestBidderId", "name email")
    .populate("bids.userId", "name email");

  if (!auction) {
    throw new ApiError(404, "Auction not found");
  }

  res.json({
    success: true,
    data: auction,
  });
});

export const createAuction = asyncHandler(async (req: Request, res: Response) => {
  const data = createAuctionSchema.parse(req.body);

  const item = await Item.findById(data.itemId);
  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user!.id) {
    throw new ApiError(403, "You can only auction your own items");
  }

  if (item.status !== "owned") {
    throw new ApiError(400, "Item must be owned to start an auction");
  }

  const existingAuction = await Auction.findOne({
    itemId: item._id,
    status: "active",
  });

  if (existingAuction) {
    throw new ApiError(400, "Item is already in an active auction");
  }

  item.status = "in_auction";
  await item.save();

  const auction = await Auction.create({
    itemId: item._id,
    sellerId: req.user!.id,
    startPrice: data.startPrice,
    currentBid: 0,
    endTime: data.endTime,
    status: "active",
  });

  const populated = await Auction.findById(auction._id)
    .populate("itemId")
    .populate("sellerId", "name email");

  res.status(201).json({
    success: true,
    data: populated,
    message: "Auction created successfully",
  });
});

export const placeBid = asyncHandler(async (req: Request, res: Response) => {
  const data = placeBidSchema.parse(req.body);
  const auctionId = req.params.id as string;
  const auction = await placeBidOnAuction(auctionId, req.user!.id, data.amount);

  res.json({
    success: true,
    data: auction,
    message: "Bid placed successfully",
  });
});
