import { Request, Response } from "express";
import User from "../models/User";
import UserStats from "../models/UserStats";
import jwt from "jsonwebtoken";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000; // 2 hours

const generateAccessToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET!, { expiresIn: "1h" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET!, { expiresIn: "7d" });
};

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const user = await User.create({ name, email, password });

    // Create initial user stats
    await UserStats.create({ user: user._id });

    return res.status(201).json({
      message: "User registered",
      userId: user._id,
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    if ((user as any).isLocked()) {
      return res.status(423).json({ message: "Account is locked due to too many failed attempts" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      (user as any).failedAttempts += 1;
      if ((user as any).failedAttempts >= MAX_FAILED_ATTEMPTS) {
        (user as any).lockUntil = new Date(Date.now() + LOCK_TIME);
      }
      await user.save();
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Reset failed attempts on successful login
    (user as any).failedAttempts = 0;
    (user as any).lockUntil = null;
    const refreshToken = generateRefreshToken(user._id.toString());
    (user as any).refreshToken = refreshToken;
    await user.save();

    const accessToken = generateAccessToken(user._id.toString());

    return res.json({
      message: "Login successful",
      accessToken,
      refreshToken
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const refreshToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(401).json({ message: "Refresh token required" });

    const decoded: any = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);
    const user = await User.findById(decoded.id);
    if (!user || (user as any).refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const newAccessToken = generateAccessToken(user._id.toString());
    return res.json({ accessToken: newAccessToken });
  } catch (err: any) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }
};
