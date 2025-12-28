// backend/src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export default function authMiddleware(req: any, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("Auth middleware: token present:", !!token);

    if (!token) {
      console.log("No token provided");
      return res.status(401).json({ message: "No token provided" });
    }

    if (!process.env.JWT_SECRET) {
      console.log("JWT_SECRET not configured");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully, user ID:", decoded.id);

    req.user = { id: decoded.id };
    next();
  } catch (err) {
    console.log("Token verification failed:", err instanceof Error ? err.message : String(err));
    return res.status(401).json({ message: "Invalid token" });
  }
}
