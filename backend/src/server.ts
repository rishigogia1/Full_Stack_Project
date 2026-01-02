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
 * ✅ FINAL CORS CONFIG (THIS FIXES EVERYTHING)
 */
app.use(
  cors({
    origin: "https://full-stack-project-edwm.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Handle preflight requests explicitly
app.options("*", cors({
  origin: "https://full-stack-project-edwm.vercel.app",
  credentials: true,
}));

app.use(express.json());

// DB
(async () => {
  await connectDB();
})();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Health
app.get("/", (_, res) => {
  res.send("API is working");
});

// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
