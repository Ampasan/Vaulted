import { Server as SocketServer } from "socket.io";
import { Types } from "mongoose";
import { Notification, NotificationType } from "../models/Notification";

let io: SocketServer | null = null;

export const setSocketServer = (server: SocketServer): void => {
  io = server;
};

export const getSocketServer = (): SocketServer | null => io;

export const createNotification = async (
  userId: string | Types.ObjectId,
  type: NotificationType,
  message: string,
  relatedId?: string | Types.ObjectId
) => {
  const notification = await Notification.create({
    userId,
    type,
    message,
    relatedId,
  });

  if (io) {
    io.to(`user:${userId.toString()}`).emit("notification", {
      id: notification._id,
      type: notification.type,
      message: notification.message,
      relatedId: notification.relatedId,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    });
  }

  return notification;
};
