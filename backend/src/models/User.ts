import mongoose, { Document, Schema } from "mongoose";

export interface ISavedCard {
  tokenId: string;
  maskedCardNumber: string;
  cardBrand: string;
  expiryMonth: string;
  expiryYear: string;
}

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash?: string;
  googleId?: string;
  location?: string;
  phoneNumber?: string;
  balance: number;
  savedCards: ISavedCard[];
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String },
    googleId: { type: String, unique: true, sparse: true },
    location: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    balance: { type: Number, default: 0 },
    savedCards: [
      {
        tokenId: { type: String, required: true },
        maskedCardNumber: { type: String, required: true },
        cardBrand: { type: String, required: true },
        expiryMonth: { type: String, required: true },
        expiryYear: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const User = mongoose.model<IUser>("User", userSchema);
