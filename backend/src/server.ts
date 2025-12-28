import dotenv from "dotenv";
dotenv.config();

// Set default JWT secrets for development if not provided
process.env.JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";
process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key-change-in-production";

import express from "express";
import cors from "cors";

import authRoutes from "./routes/authRoutes";
import interviewRoutes from "./routes/interviewRoutes";
import { errorHandler } from "./middleware/validation";
import connectDB from "./config/database";

const app = express();
app.use(cors());
app.use(express.json());

// Connect to database
(async () => {
  await connectDB();
})();

// ----------------------------
// MOUNT ROUTES PROPERLY HERE
// ----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/interview", interviewRoutes);

// Global error handler (must be last)
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API is working");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
console.log("Loaded OPENROUTER KEY:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");
console.log("Loaded JWT_SECRET:", process.env.JWT_SECRET ? "YES" : "NO");
console.log("Loaded JWT_REFRESH_SECRET:", process.env.JWT_REFRESH_SECRET ? "YES" : "NO");
console.log("Server started successfully");

