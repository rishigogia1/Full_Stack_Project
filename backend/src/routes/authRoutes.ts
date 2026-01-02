import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";

import { handleValidationErrors } from "../middleware/validation";
import {
  registerUser,
  loginUser,
  refreshToken,
} from "../controllers/authController";

const router = Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
});

router.post(
  "/register",
  [
    body("name").isLength({ min: 2 }),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  handleValidationErrors,
  registerUser
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail(),
    body("password").notEmpty(),
  ],
  handleValidationErrors,
  loginUser
);

router.post("/refresh", refreshToken);

export default router;
