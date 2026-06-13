import mongoose, { Document, Schema, Types } from "mongoose";

export type TransactionType = "marketplace_purchase" | "auction_win";
export type TransactionStatus = "completed" | "failed";

export interface ITransaction extends Document {
  buyerId: Types.ObjectId;
  sellerId: Types.ObjectId;
  itemId: Types.ObjectId;
  amount: number;
  type: TransactionType;
  status: TransactionStatus;
  createdAt: Date;
  updatedAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
  {
    buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sellerId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
    amount: { type: Number, required: true, min: 0 },
    type: {
      type: String,
      enum: ["marketplace_purchase", "auction_win"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

export const Transaction = mongoose.model<ITransaction>("Transaction", transactionSchema);
