import { Request, Response, NextFunction } from "express";
import jwt, { SignOptions } from "jsonwebtoken";
import { ApiError } from "../utils/ApiError";

interface JwtPayload {
  id: string;
  email: string;
  name: string;
}

export const authMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new ApiError(401, "Authentication required"));
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    next(new ApiError(500, "JWT secret is not configured"));
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch {
    next(new ApiError(401, "Invalid or expired token"));
  }
};

export const signToken = (payload: JwtPayload): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new ApiError(500, "JWT secret is not configured");
  }

  const options: SignOptions = {
    expiresIn: (process.env.JWT_EXPIRES_IN ?? "7d") as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, options);
};
