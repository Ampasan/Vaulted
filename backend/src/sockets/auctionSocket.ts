import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import {
  checkExpiredAuctions,
  placeBidOnAuction,
  scheduleAuctionEndingNotifications,
} from "../services/auctionService";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

const authenticateSocket = (socket: Socket): string | null => {
  const token = socket.handshake.auth?.token as string | undefined;

  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    return decoded.id;
  } catch {
    return null;
  }
};

export const setupAuctionSocket = (io: SocketServer): void => {
  io.use((socket, next) => {
    const userId = authenticateSocket(socket);
    if (!userId) {
      next(new Error("Authentication required"));
      return;
    }
    socket.data.userId = userId;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.data.userId as string;
    socket.join(`user:${userId}`);

    socket.on("join_auction", ({ auctionId }: { auctionId: string }) => {
      socket.join(`auction:${auctionId}`);
    });

    socket.on("leave_auction", ({ auctionId }: { auctionId: string }) => {
      socket.leave(`auction:${auctionId}`);
    });

    socket.on(
      "place_bid",
      async (
        { auctionId, amount }: { auctionId: string; amount: number },
        callback?: (response: { success: boolean; message?: string }) => void
      ) => {
        try {
          await placeBidOnAuction(auctionId, userId, amount);
          callback?.({ success: true });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Failed to place bid";
          callback?.({ success: false, message });
        }
      }
    );
  });

  setInterval(async () => {
    try {
      await checkExpiredAuctions();
      await scheduleAuctionEndingNotifications();
    } catch (error) {
      console.error("Auction scheduler error:", error);
    }
  }, 30_000);
};
