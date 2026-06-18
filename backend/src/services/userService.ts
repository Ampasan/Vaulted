import { Types } from "mongoose";
import { User, IUser } from "../models/User";
import { Item } from "../models/Item";
import { ApiError } from "../utils/ApiError";

export type UserTier = "Unverified" | "Normal" | "Elite" | "Platinum";
export type BuyerTierRequirement = "Normal" | "Elite" | "Platinum";

export const TIER_THRESHOLDS = {
  ELITE: 300_000,
  PLATINUM: 1_000_000,
} as const;

const TIER_LEVELS: Record<UserTier, number> = {
  Unverified: 0,
  Normal: 1,
  Elite: 2,
  Platinum: 3,
};

export interface UserWithTierDetails {
  user: IUser;
  identityVerified: boolean;
  portfolioValue: number;
  tier: UserTier;
}

export const normalizeBuyerTier = (
  tier?: string | null
): BuyerTierRequirement | null => {
  if (!tier || tier.trim() === "") {
    return null;
  }

  if (tier === "Normal" || tier === "Elite" || tier === "Platinum") {
    return tier;
  }

  return null;
};

export const getEffectiveBuyerTier = (item: Pick<Item, "buyerTier" | "extrasRating">): BuyerTierRequirement | null => {
  return normalizeBuyerTier(item.buyerTier) ?? normalizeBuyerTier(item.extrasRating);
};

export const getTierLevel = (tier?: string | null): number => {
  if (!tier) {
    return 0;
  }

  const normalized = normalizeBuyerTier(tier);
  if (normalized) {
    return TIER_LEVELS[normalized];
  }

  if (tier in TIER_LEVELS) {
    return TIER_LEVELS[tier as UserTier];
  }

  return 0;
};

export const getUserTierDetails = async (
  userId: string | Types.ObjectId
): Promise<UserWithTierDetails | null> => {
  const user = await User.findById(userId);
  if (!user) return null;

  const identityVerified = Boolean(
    user.name?.trim() &&
      user.location?.trim() &&
      user.phoneNumber?.trim()
  );

  const ownedItems = await Item.find({ ownerId: user._id, status: "owned" });
  const portfolioValue = ownedItems.reduce(
    (sum, item) => sum + (item.currentPrice || 0),
    0
  );

  let tier: UserTier = "Unverified";
  if (identityVerified) {
    if (portfolioValue >= TIER_THRESHOLDS.PLATINUM) {
      tier = "Platinum";
    } else if (portfolioValue >= TIER_THRESHOLDS.ELITE) {
      tier = "Elite";
    } else {
      tier = "Normal";
    }
  }

  return {
    user,
    identityVerified,
    portfolioValue,
    tier,
  };
};

export const assertBuyerTierAccess = (
  buyerTier: UserTier,
  item: Pick<Item, "buyerTier" | "extrasRating">
): void => {
  const requiredTier = getEffectiveBuyerTier(item);

  if (!requiredTier) {
    return;
  }

  const buyerLevel = getTierLevel(buyerTier);
  if (buyerLevel === 0) {
    throw new ApiError(
      403,
      "Complete your identity verification to purchase restricted items."
    );
  }

  const requiredLevel = getTierLevel(requiredTier);
  if (requiredLevel > buyerLevel) {
    throw new ApiError(
      403,
      `This item requires ${requiredTier} tier. Your current tier is ${buyerTier}.`
    );
  }
};
