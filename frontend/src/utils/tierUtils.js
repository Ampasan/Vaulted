export const BUYER_TIER_OPTIONS = [
  { value: '', label: 'No restriction' },
  { value: 'Normal', label: 'Normal Verified' },
  { value: 'Elite', label: 'Elite Collector' },
  { value: 'Platinum', label: 'Platinum Collector' },
];

const LEGACY_TIER_MAP = {
  standard: 'Normal',
  premium: 'Elite',
  institutional: 'Platinum',
  'tier-2': 'Elite',
  'tier-3': 'Platinum',
};

export const normalizeBuyerTier = (tier) => {
  if (!tier || tier.trim() === '') return null;
  if (tier === 'Normal' || tier === 'Elite' || tier === 'Platinum') return tier;
  return LEGACY_TIER_MAP[tier] ?? null;
};

export const getEffectiveBuyerTier = (item) => {
  if (!item) return null;
  return normalizeBuyerTier(item.buyerTier) ?? normalizeBuyerTier(item.extrasRating);
};

export const formatBuyerTierLabel = (tier) => {
  const normalized = normalizeBuyerTier(tier);
  if (!normalized) return null;
  return `${normalized} Collector`;
};

export const formatUserTierLabel = (tier) => {
  if (!tier || tier === 'Unverified') return 'Unverified Collector';
  return `${tier} Collector`;
};

const TIER_LEVELS = {
  Unverified: 0,
  Normal: 1,
  Elite: 2,
  Platinum: 3,
};

export const getTierLevel = (tier) => {
  if (!tier) return 0;
  const normalized = normalizeBuyerTier(tier);
  if (normalized) return TIER_LEVELS[normalized];
  if (tier in TIER_LEVELS) return TIER_LEVELS[tier];
  return 0;
};

export const checkBuyerTierAccess = (userTier, item) => {
  const requiredTier = getEffectiveBuyerTier(item);

  if (!requiredTier) {
    return { allowed: true };
  }

  const buyerLevel = getTierLevel(userTier);
  if (buyerLevel === 0) {
    return {
      allowed: false,
      message: 'Complete your identity verification to access this item.',
    };
  }

  const requiredLevel = getTierLevel(requiredTier);
  if (requiredLevel > buyerLevel) {
    return {
      allowed: false,
      message: `This item requires ${formatBuyerTierLabel(requiredTier)}. Your current tier is ${formatUserTierLabel(userTier)}.`,
    };
  }

  return { allowed: true };
};
