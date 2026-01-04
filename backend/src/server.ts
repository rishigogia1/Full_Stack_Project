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
 * ✅ ALLOWED ORIGINS
 * - localhost (development)
 * - vercel production frontend
 */
const allowedOrigins = [
  "http://localhost:5173",
  "https://full-stack-project-edwm.vercel.app",
  "https://full-stack-project-iota-nine.vercel.app",
];

// ✅ FINAL CORS CONFIG
app.use(
  cors({
    origin: (origin, callback) => {
      // allow non-browser requests (Thunder Client, Postman)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("CORS not allowed"));
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// important for preflight
app.options("*", cors());

app.use(express.json());

// DB
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
