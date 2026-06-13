import mongoose, { Document, Schema, Types } from "mongoose";

export type AuctionStatus = "active" | "ended" | "cancelled";

export interface IBid {
  userId: Types.ObjectId;
  amount: number;
  createdAt: Date;
}

export interface IAuction extends Document {
  itemId: Types.ObjectId;
  sellerId: Types.ObjectId;
  startPrice: number;
  currentBid: number;
  highestBidderId?: Types.ObjectId;
  bids: IBid[];
  startTime: Date;
  endTime: Date;
  status: AuctionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const bidSchema = new Schema<IBid>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const auctionSchema = new Schema<IAuction>(
  {
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    startPrice: { type: Number, required: true, min: 0 },
    currentBid: { type: Number, default: 0 },
    highestBidderId: { type: Schema.Types.ObjectId, ref: "User" },
    bids: { type: [bidSchema], default: [] },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: ["active", "ended", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);

export const Auction = mongoose.model<IAuction>("Auction", auctionSchema);
