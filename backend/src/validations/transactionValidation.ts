import { z } from "zod";

export const addWishlistSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
});
