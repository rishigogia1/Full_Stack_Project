import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import connectDB from "./config/database";
import { errorHandler } from "./middleware/validation";

dotenv.config();

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://full-stack-project-iota-nine.vercel.app",
    ],
    credentials: true,
  })
);

app.use(express.json());

/* -------------------- DB -------------------- */
connectDB();

/* -------------------- ROUTES -------------------- */
app.get("/", (_req, res) => {
  res.status(200).json({ message: "Backend API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

/* -------------------- ERROR HANDLER -------------------- */
app.use(errorHandler);

/* -------------------- EXPORT FOR VERCEL -------------------- */
export default app;
