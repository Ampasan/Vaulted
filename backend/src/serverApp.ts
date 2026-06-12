import express from "express";
import cors from "cors";
import http from "http";

export const createApp = () => {
  const app = express();
  const server = http.createServer(app);
  const clientUrl = process.env.CLIENT_URL ?? "http://localhost:5173";

  app.use(cors({ origin: clientUrl }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  return { app, server };
};
