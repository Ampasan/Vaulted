import mongoose, { Document, Schema, Types } from "mongoose";

export interface IWishlist extends Document {
  userId: Types.ObjectId;
  itemId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const wishlistSchema = new Schema<IWishlist>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    itemId: { type: Schema.Types.ObjectId, ref: "Item", required: true },
  },
  { timestamps: true }
);

wishlistSchema.index({ userId: 1, itemId: 1 }, { unique: true });

export const Wishlist = mongoose.model<IWishlist>("Wishlist", wishlistSchema);
