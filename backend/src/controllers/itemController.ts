import { Request, Response } from "express";
import { Item } from "../models/Item";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import {
  addPriceHistorySchema,
  createItemSchema,
  updateItemSchema,
} from "../validations/itemValidation";

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (req.query.status) {
    filter.status = req.query.status;
  }
  if (req.query.search) {
    filter.name = { $regex: req.query.search, $options: "i" };
  }

  const [items, total] = await Promise.all([
    Item.find(filter)
      .populate("ownerId", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Item.countDocuments(filter),
  ]);

  res.json({
    success: true,
    data: {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    },
  });
});

export const getMyCollection = asyncHandler(async (req: Request, res: Response) => {
  const items = await Item.find({ ownerId: req.user!.id }).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: items,
  });
});

export const getItemById = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id).populate("ownerId", "name email");

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  res.json({
    success: true,
    data: item,
  });
});

export const createItem = asyncHandler(async (req: Request, res: Response) => {
  const data = createItemSchema.parse(req.body);

  const item = await Item.create({
    ...data,
    ownerId: req.user!.id,
    priceHistory: [{ price: data.currentPrice, recordedAt: new Date() }],
  });

  res.status(201).json({
    success: true,
    data: item,
    message: "Item created successfully",
  });
});

export const updateItem = asyncHandler(async (req: Request, res: Response) => {
  const data = updateItemSchema.parse(req.body);
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user!.id) {
    throw new ApiError(403, "You can only update your own items");
  }

  if (item.status === "in_auction" || item.status === "sold") {
    throw new ApiError(400, "Cannot update item in current status");
  }

  Object.assign(item, data);
  await item.save();

  res.json({
    success: true,
    data: item,
    message: "Item updated successfully",
  });
});

export const deleteItem = asyncHandler(async (req: Request, res: Response) => {
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user!.id) {
    throw new ApiError(403, "You can only delete your own items");
  }

  if (item.status === "in_auction") {
    throw new ApiError(400, "Cannot delete item that is in auction");
  }

  await item.deleteOne();

  res.json({
    success: true,
    message: "Item deleted successfully",
  });
});

export const addPriceHistory = asyncHandler(async (req: Request, res: Response) => {
  const data = addPriceHistorySchema.parse(req.body);
  const item = await Item.findById(req.params.id);

  if (!item) {
    throw new ApiError(404, "Item not found");
  }

  if (item.ownerId.toString() !== req.user!.id) {
    throw new ApiError(403, "You can only update your own items");
  }

  item.priceHistory.push({
    price: data.price,
    recordedAt: new Date(),
  });
  item.currentPrice = data.price;
  await item.save();

  res.json({
    success: true,
    data: item,
    message: "Price history updated",
  });
});
