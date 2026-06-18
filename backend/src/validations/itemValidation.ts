import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  description: z.string().optional(),
  imageUrl: z.array(z.string()).optional(),
  currentPrice: z.number().min(0, "Price must be non-negative").optional(),
  category: z.string().optional(),
  year: z.string().optional(),
  condition: z.string().optional(),
  buyerTier: z
    .union([z.enum(["Normal", "Elite", "Platinum"]), z.literal("")])
    .optional(),
  extrasRating: z.string().optional(),
  verificationDocument: z.string().optional(),
});

export const updateItemSchema = createItemSchema.partial();

export const addPriceHistorySchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
});

export const listMarketplaceSchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
});
