import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import { errorHandler } from "./middleware/validation";
import connectDB from "./config/database";

const app = express();

/**
 * ✅ CORS – EXPLICIT & SAFE
 */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://full-stack-project-iota-nine.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 🔥 IMPORTANT: handle preflight
app.options("*", cors());

app.use(express.json());

// Connect DB
(async () => {
  await connectDB();
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Health check
app.get("/", (_req, res) => {
  res.send("API is working");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
