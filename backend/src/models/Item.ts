import mongoose, { Document, Schema, Types } from "mongoose";

export type ItemStatus = "owned" | "listed_marketplace" | "in_auction" | "sold";

export interface IPriceHistoryEntry {
  price: number;
  recordedAt: Date;
}

export interface Item extends Document {
  ownerId: Types.ObjectId;
  name: string;
  description: string;
  imageUrl: string;
  currentPrice: number;
  priceHistory: IPriceHistoryEntry[];
  status: ItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

const priceHistorySchema = new Schema<IPriceHistoryEntry>(
  {
    price: { type: Number, required: true },
    recordedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const itemSchema = new Schema<Item>(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    currentPrice: { type: Number, required: true, min: 0 },
    priceHistory: { type: [priceHistorySchema], default: [] },
    status: {
      type: String,
      enum: ["owned", "listed_marketplace", "in_auction", "sold"],
      default: "owned",
    },
  },
  { timestamps: true }
);

export const Item = mongoose.model<Item>("Item", itemSchema);
