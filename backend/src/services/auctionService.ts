import mongoose from "mongoose";
import { Auction, IAuction } from "../models/Auction";
import { Item } from "../models/Item";
import { Transaction } from "../models/Transaction";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { createNotification, getSocketServer } from "./notificationService";

const getMinBidIncrement = (): number => {
  return Number(process.env.MIN_BID_INCREMENT ?? 1000);
};

export const placeBidOnAuction = async (
  auctionId: string,
  userId: string,
  amount: number
): Promise<IAuction> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auction = await Auction.findById(auctionId).session(session);

    if (!auction) {
      throw new ApiError(404, "Auction not found");
    }

    if (auction.status !== "active") {
      throw new ApiError(400, "Auction is not active");
    }

    if (auction.endTime <= new Date()) {
      throw new ApiError(400, "Auction has ended");
    }

    if (auction.sellerId.toString() === userId) {
      throw new ApiError(400, "You cannot bid on your own auction");
    }

    const minRequired =
      auction.currentBid > 0
        ? auction.currentBid + getMinBidIncrement()
        : auction.startPrice;

    if (amount < minRequired) {
      throw new ApiError(400, `Bid must be at least ${minRequired}`);
    }

    const bidder = await User.findById(userId).session(session);
    if (!bidder) {
      throw new ApiError(404, "User not found");
    }

    if (bidder.balance < amount) {
      throw new ApiError(400, "Insufficient balance");
    }

    const previousBidderId = auction.highestBidderId?.toString();

    auction.currentBid = amount;
    auction.highestBidderId = new mongoose.Types.ObjectId(userId);
    auction.bids.push({
      userId: new mongoose.Types.ObjectId(userId),
      amount,
      createdAt: new Date(),
    });

    await auction.save({ session });
    await session.commitTransaction();

    const io = getSocketServer();
    if (io) {
      io.to(`auction:${auctionId}`).emit("bid_update", {
        auctionId,
        currentBid: auction.currentBid,
        highestBidderId: auction.highestBidderId,
        bids: auction.bids,
      });
    }

    if (previousBidderId && previousBidderId !== userId) {
      await createNotification(
        previousBidderId,
        "outbid",
        `You have been outbid on auction. New bid: ${amount}`,
        auction._id
      );
    }

    return auction;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const finalizeAuction = async (auctionId: string): Promise<void> => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const auction = await Auction.findById(auctionId).session(session);

    if (!auction || auction.status !== "active" || auction.endTime > new Date()) {
      await session.abortTransaction();
      return;
    }

    auction.status = "ended";

    const item = await Item.findById(auction.itemId).session(session);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }

    if (!auction.highestBidderId || auction.currentBid <= 0) {
      item.status = "owned";
      await item.save({ session });
      await auction.save({ session });
      await session.commitTransaction();
      return;
    }

    const buyer = await User.findById(auction.highestBidderId).session(session);
    const seller = await User.findById(auction.sellerId).session(session);

    if (!buyer || !seller) {
      throw new ApiError(404, "Buyer or seller not found");
    }

    if (buyer.balance < auction.currentBid) {
      auction.status = "cancelled";
      item.status = "owned";
      await item.save({ session });
      await auction.save({ session });
      await session.commitTransaction();
      return;
    }

    buyer.balance -= auction.currentBid;
    seller.balance += auction.currentBid;

    item.ownerId = buyer._id;
    item.currentPrice = auction.currentBid;
    item.status = "owned";
    item.priceHistory.push({
      price: auction.currentBid,
      recordedAt: new Date(),
    });

    await buyer.save({ session });
    await seller.save({ session });
    await item.save({ session });
    await auction.save({ session });

    await Transaction.create(
      [
        {
          buyerId: buyer._id,
          sellerId: seller._id,
          itemId: item._id,
          amount: auction.currentBid,
          type: "auction_win",
          status: "completed",
        },
      ],
      { session }
    );

    await session.commitTransaction();

    const io = getSocketServer();
    if (io) {
      io.to(`auction:${auctionId}`).emit("auction_ended", {
        auctionId,
        winnerId: buyer._id,
        finalBid: auction.currentBid,
      });
    }

    await createNotification(
      buyer._id,
      "auction_won",
      `You won the auction for ${item.name} at ${auction.currentBid}`,
      auction._id
    );

    await createNotification(
      seller._id,
      "transaction_success",
      `Your item ${item.name} was sold via auction for ${auction.currentBid}`,
      item._id
    );
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

export const checkExpiredAuctions = async (): Promise<void> => {
  const expiredAuctions = await Auction.find({
    status: "active",
    endTime: { $lte: new Date() },
  }).select("_id");

  for (const auction of expiredAuctions) {
    await finalizeAuction(auction._id.toString());
  }
};

export const scheduleAuctionEndingNotifications = async (): Promise<void> => {
  const soonEnding = await Auction.find({
    status: "active",
    endTime: {
      $gt: new Date(),
      $lte: new Date(Date.now() + 5 * 60 * 1000),
    },
  }).populate("itemId", "name");

  for (const auction of soonEnding) {
    const item = auction.itemId as { name?: string } | null;
    const watchers = auction.bids.map((bid) => bid.userId.toString());
    const uniqueWatchers = [...new Set(watchers)];

    for (const watcherId of uniqueWatchers) {
      await createNotification(
        watcherId,
        "auction_ending",
        `Auction for ${item?.name ?? "an item"} is ending soon`,
        auction._id
      );
    }
  }
};
