import express from "express";
import cors from "cors";
import http from "http";
import { errorMiddleware } from "./middlewares/errorMiddleware";

import authRoutes from "./routes/authRoutes";

export const createApp = () => {
  const app = express();
  const server = http.createServer(app);
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

  app.use(cors({ origin: clientUrl }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use("/api/auth", authRoutes);

  app.use(errorMiddleware);

  return { app, server };
};
