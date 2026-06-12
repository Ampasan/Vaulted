import express from "express";
import cors from "cors";
import http from "http";
import { Server as SocketServer } from "socket.io";
import { errorMiddleware } from "./middlewares/errorMiddleware";
import { setSocketServer } from "./services/notificationService";

import authRoutes from "./routes/authRoutes";
import itemRoutes from "./routes/itemRoutes";
import marketplaceRoutes from "./routes/marketplaceRoutes";
import notificationRoutes from "./routes/notificationRoutes";

export const createApp = () => {
  const app = express();
  const server = http.createServer(app);
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

  const io = new SocketServer(server, {
    cors: {
      origin: clientUrl,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    },
  });

  setSocketServer(io);

  app.use(cors({ origin: clientUrl }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/auth", authRoutes);
  app.use("/api/items", itemRoutes);
  app.use("/api/marketplace", marketplaceRoutes);
  app.use("/api/notifications", notificationRoutes);

  app.use(errorMiddleware);

  return { app, server };
};
