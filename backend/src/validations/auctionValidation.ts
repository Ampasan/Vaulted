import { z } from "zod";

export const createAuctionSchema = z.object({
  itemId: z.string().min(1, "Item ID is required"),
  startPrice: z.number().min(0, "Start price must be non-negative"),
  endTime: z.coerce.date().refine((date) => date > new Date(), {
    message: "End time must be in the future",
  }),
});

export const placeBidSchema = z.object({
  amount: z.number().min(0, "Bid amount must be non-negative"),
});
