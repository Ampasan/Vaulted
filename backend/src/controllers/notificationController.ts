import { Request, Response } from "express";
import { Notification } from "../models/Notification";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const filter: Record<string, unknown> = { userId: req.user!.id };

  if (req.query.unreadOnly === "true") {
    filter.isRead = false;
  }

  const notifications = await Notification.find(filter).sort({ createdAt: -1 });

  res.json({
    success: true,
    data: notifications,
  });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: req.params.id, userId: req.user!.id },
    { isRead: true },
    { new: true }
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  res.json({
    success: true,
    data: notification,
  });
});

export const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  await Notification.updateMany(
    { userId: req.user!.id, isRead: false },
    { isRead: true }
  );

  res.json({
    success: true,
    message: "All notifications marked as read",
  });
});
