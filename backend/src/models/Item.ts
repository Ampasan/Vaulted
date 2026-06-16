import mongoose, { Document, Schema, Types } from "mongoose";

export type ItemStatus = "owned" | "listed_marketplace" | "in_auction" | "sold";

export interface IPriceHistoryEntry {
  price: number;
  recordedAt: Date;
}

export interface Item extends Document {
  ownerId: Types.ObjectId;
  name: string;
  title?: string;
  category?: string;
  year?: string;
  condition?: string;
  buyerTier?: string;
  extrasRating?: string;
  description: string;
  imageUrl: string[];
  currentPrice: number;
  priceHistory: IPriceHistoryEntry[];
  status: ItemStatus;
  verificationDocument?: string;
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
    title: { type: String, trim: true },
    category: { type: String, trim: true },
    year: { type: String, trim: true },
    condition: { type: String, trim: true },
    buyerTier: { type: String, trim: true },
    extrasRating: { type: String, trim: true },
    description: { type: String, default: "" },
    imageUrl: { type: [String], default: [] },
    currentPrice: { type: Number, required: true, min: 0 },
    priceHistory: { type: [priceHistorySchema], default: [] },
    status: {
      type: String,
      enum: ["owned", "listed_marketplace", "in_auction", "sold"],
      default: "owned",
    },
    verificationDocument: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Item = mongoose.model<Item>("Item", itemSchema);
