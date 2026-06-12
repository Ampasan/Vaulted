import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { ApiError } from "../utils/ApiError";
import { asyncHandler } from "../utils/asyncHandler";
import { signToken } from "../middlewares/authMiddleware";
import { loginSchema, registerSchema } from "../validations/authValidation";

const sanitizeUser = (user: InstanceType<typeof User>) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  balance: user.balance,
  createdAt: user.createdAt,
});

export const register = asyncHandler(async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);

  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    throw new ApiError(409, "Email already registered");
  }

  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({
    name: data.name,
    email: data.email,
    passwordHash,
  });

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  res.status(201).json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token,
    },
    message: "Registration successful",
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);

  const user = await User.findOne({ email: data.email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isMatch = await bcrypt.compare(data.password, user.passwordHash);
  if (!isMatch) {
    throw new ApiError(401, "Invalid email or password");
  }

  const token = signToken({
    id: user._id.toString(),
    email: user.email,
    name: user.name,
  });

  res.json({
    success: true,
    data: {
      user: sanitizeUser(user),
      token,
    },
    message: "Login successful",
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.id).select("-passwordHash");
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  res.json({
    success: true,
    data: sanitizeUser(user),
  });
});
