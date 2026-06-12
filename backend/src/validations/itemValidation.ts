import { z } from "zod";

export const createItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: "Invalid image URL",
    }),
  currentPrice: z.number().min(0, "Price must be non-negative"),
});

export const updateItemSchema = createItemSchema.partial();

export const addPriceHistorySchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
});

export const listMarketplaceSchema = z.object({
  price: z.number().min(0, "Price must be non-negative"),
});
