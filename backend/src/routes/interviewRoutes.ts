// backend/src/routes/interviewRoutes.ts

import express from "express";
import { body } from "express-validator";
import { handleValidationErrors } from "../middleware/validation";
import authMiddleware from "../middleware/authMiddleware";
import {
  createSession,
  getMySessions,
  getSessionById,
  evaluateUserAnswer,
  getAnalytics,
  getResources,
  getLeaderboards,
  getPerformancePredictions,
  createQuestionBank,
  getMyQuestionBanks,
  getPublicQuestionBanks,
  getQuestionBank,
  updateQuestionBankVisibility,
  addQuestionToBank,
  deleteQuestionBank,
  quickSaveQuestion,
} from "../controllers/interviewController";

const router = express.Router();

// ---------------- INTERVIEW ----------------
router.post(
  "/create",
  authMiddleware,
  [
    body("topic").trim().notEmpty().withMessage("Topic is required"),
    body("category")
      .optional()
      .isIn([
        "technical",
        "behavioral",
        "system-design",
        "data-structures",
        "algorithms",
        "frontend",
        "backend",
        "devops",
        "custom",
      ]),
    body("difficulty").optional().isIn(["beginner", "intermediate", "advanced"]),
    body("questionCount").optional().isInt({ min: 1, max: 20 }),
    body("timePerQuestion").optional().isInt({ min: 30, max: 300 }),
  ],
  handleValidationErrors,
  createSession
);

router.get("/my-sessions", authMiddleware, getMySessions);
router.get("/analytics", authMiddleware, getAnalytics);
router.get("/predictions", authMiddleware, getPerformancePredictions);

// ✅ RESOURCES — PUBLIC (IMPORTANT FIX)
router.get("/resources", getResources);

// ---------------- LEADERBOARD ----------------
router.get("/leaderboards", authMiddleware, getLeaderboards);

// ---------------- SESSION ----------------
router.post("/evaluate", authMiddleware, evaluateUserAnswer);
router.get("/:id", authMiddleware, getSessionById);

// ---------------- QUESTION BANK ----------------
router.post("/question-banks/create", authMiddleware, createQuestionBank);
router.get("/question-banks/my-banks", authMiddleware, getMyQuestionBanks);
router.get("/question-banks/public", authMiddleware, getPublicQuestionBanks);
router.get("/question-banks/:bankId", authMiddleware, getQuestionBank);
router.patch(
  "/question-banks/:bankId/visibility",
  authMiddleware,
  updateQuestionBankVisibility
);
router.post(
  "/question-banks/:bankId/questions",
  authMiddleware,
  addQuestionToBank
);
router.delete(
  "/question-banks/:bankId",
  authMiddleware,
  deleteQuestionBank
);
router.post(
  "/question-banks/:bankId/questions/quick-save",
  authMiddleware,
  quickSaveQuestion
);

export default router;
