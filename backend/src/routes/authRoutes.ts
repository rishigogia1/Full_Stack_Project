import { Router } from "express";
const { body } = require("express-validator");
const rateLimit = require("express-rate-limit");
import { handleValidationErrors } from "../middleware/validation";
import { registerUser, loginUser, refreshToken } from "../controllers/authController";

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: "Too many authentication attempts, please try again later.",
  standardHeaders: true,
  legacyHeaders: false,
});

const router = Router();

router.post(
  "/register",
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
  ],
  handleValidationErrors,
  registerUser
);  // /api/auth/register

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().normalizeEmail().withMessage("Invalid email"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  handleValidationErrors,
  loginUser
);        // /api/auth/login

router.post("/refresh", refreshToken);  // /api/auth/refresh

export default router;
