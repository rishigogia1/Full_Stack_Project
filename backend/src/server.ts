import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import { errorHandler } from "./middleware/validation";
import connectDB from "./config/database";

const app = express();

/* =========================
   ✅ CORS CONFIG (FINAL)
   ========================= */
app.use(
  cors({
    origin: "https://full-stack-project-iota-nine.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ⚠️ IMPORTANT: Express 5 needs this
app.options("*", cors());

app.use(express.json());

/* =========================
   DB CONNECT
   ========================= */
(async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully");
  } catch (err) {
    console.error("MongoDB connection failed", err);
    process.exit(1);
  }
})();

/* =========================
   ROUTES
   ========================= */
app.get("/", (_req, res) => {
  res.send("API is working");
});

app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

/* =========================
   ERROR HANDLER (LAST)
   ========================= */
app.use(errorHandler);

/* =========================
   START SERVER
   ========================= */
const PORT = Number(process.env.PORT) || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
