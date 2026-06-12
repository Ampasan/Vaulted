import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError";

export const errorMiddleware = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.issues.map((issue) => issue.message).join(", ");
    res.status(400).json({
      success: false,
      message,
    });
    return;
  }

  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
