import { z } from "zod";

export const createAuctionSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  startPrice: z.number().min(0, "Start price must be non-negative"),
  endTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "End time must be in the future",
  }),
  reservePrice: z.number().min(0, "Reserve price must be non-negative").optional(),
  bidIncrement: z.number().min(1, "Bid increment must be at least 1").optional(),
  buyNowEnabled: z.boolean().optional(),
  buyNowPrice: z.number().min(0, "Buy now price must be non-negative").optional(),
  scheduledStart: z.coerce.date().optional(),
}).refine(
  (data) => {
    if (data.buyNowEnabled && !data.buyNowPrice) {
      return false;
    }
    return true;
  },
  { message: "Buy now price is required when buy now is enabled" }
);

export const placeBidSchema = z.object({
  amount: z.number().min(0, "Bid amount must be non-negative"),
});
