// backend/src/controllers/interviewController.ts

import { Request, Response } from "express";
import InterviewSession from "../models/InterviewSession";
import User from "../models/User";
import UserStats from "../models/UserStats";
import StudyResource from "../models/StudyResource";
import QuestionBank from "../models/QuestionBank";
import { generateQuestions } from "../services/questionService";
import { evaluateAnswer } from "../services/evaluationService";

// Extend Request so req.user.id works
interface AuthRequest extends Request {
  user?: { id: string };
}

// ------------------------------
// CREATE INTERVIEW SESSION (AI)
// ------------------------------
export const createSession = async (req: AuthRequest, res: Response) => {
  try {
    console.log("Create session called with body:", req.body);
    console.log("User ID:", req.user?.id);

    const { topic, category, difficulty, questionCount, timePerQuestion } = req.body;
    if (!topic) {
      console.log("No topic provided");
      return res.status(400).json({ message: "Topic is required" });
    }

    // Check if user exists
    const user = await User.findById(req.user?.id);
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("Generating questions for topic:", topic, "category:", category, "difficulty:", difficulty);
    const questions = await generateQuestions(topic, questionCount || 5, category || 'technical', difficulty || 'intermediate');
    console.log("Generated questions:", questions.length);

    console.log("Creating session in DB");
    const session = await InterviewSession.create({
      user: req.user?.id,
      topic,
      category: category || 'technical',
      difficulty: difficulty || 'intermediate',
      questionCount: questionCount || 5,
      timePerQuestion: timePerQuestion || 60,
      questions,
    });

    console.log("Session created with ID:", session._id);
    return res.status(201).json({ success: true, session });

  } catch (err: any) {
    console.error("Error in createSession:", err);
    return res.status(500).json({ message: err.message });
  }
};

// ------------------------------
// GET ALL USER SESSIONS
// ------------------------------
export const getMySessions = async (req: AuthRequest, res: Response) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user?.id });
    return res.json({ sessions });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

// ------------------------------
// GET USER ANALYTICS
// ------------------------------
export const getAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const userStats = await UserStats.findOne({ user: userId });

    if (!userStats) {
      return res.json({
        stats: {
          totalQuestionsAnswered: 0,
          totalSessionsCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 0,
        },
        categoryPerformance: [],
        recentSessions: [],
        performanceOverTime: [],
        categoryTrends: [],
        dailyStats: [],
        weaknesses: [],
        studyStreak: 0,
        achievements: [],
      });
    }

    // Get recent sessions
    const recentSessions = await InterviewSession.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .select('topic createdAt questions totalScore category difficulty');

    // Calculate performance over time (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const sessionsOverTime = await InterviewSession.find({
      user: userId,
      createdAt: { $gte: thirtyDaysAgo }
    }).sort({ createdAt: 1 });

    const performanceOverTime = sessionsOverTime.map(session => ({
      date: session.createdAt.toISOString().split('T')[0],
      score: session.totalScore || 0,
      questions: session.questions?.length || 0,
      category: session.category,
    }));

    // Calculate category trends
    const categoryTrends = userStats.categoryStats?.map((cat: any) => ({
      category: cat.category,
      averageScore: cat.averageScore,
      totalQuestions: cat.totalQuestions,
      improvement: cat.improvement || 0,
    })) || [];

    // Calculate daily stats for the last 7 days
    const dailyStats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const daySessions = await InterviewSession.find({
        user: userId,
        createdAt: {
          $gte: new Date(dateStr + 'T00:00:00.000Z'),
          $lt: new Date(dateStr + 'T23:59:59.999Z')
        }
      });

      const dayStats = daySessions.reduce((acc, session) => ({
        questions: acc.questions + (session.questions?.length || 0),
        score: acc.score + (session.totalScore || 0),
        sessions: acc.sessions + 1,
      }), { questions: 0, score: 0, sessions: 0 });

      dailyStats.push({
        date: dateStr,
        questions: dayStats.questions,
        averageScore: dayStats.sessions > 0 ? dayStats.score / dayStats.sessions : 0,
        sessions: dayStats.sessions,
      });
    }

    // Calculate weaknesses (categories with lowest scores)
    const weaknesses = categoryTrends
      .filter(cat => cat.averageScore < 70)
      .sort((a, b) => a.averageScore - b.averageScore)
      .slice(0, 3);

    // Calculate study streak
    let studyStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < 30; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);

      const sessionsOnDate = await InterviewSession.find({
        user: userId,
        createdAt: {
          $gte: checkDate,
          $lt: new Date(checkDate.getTime() + 24 * 60 * 60 * 1000)
        }
      });

      if (sessionsOnDate.length > 0) {
        studyStreak++;
      } else {
        break;
      }
    }

    // Calculate achievements
    const achievements = [];
    if (userStats.totalSessionsCompleted >= 10) {
      achievements.push({ name: "Dedicated Learner", description: "Completed 10 sessions", icon: "🎯" });
    }
    if (userStats.averageScore >= 85) {
      achievements.push({ name: "High Achiever", description: "Average score above 85%", icon: "⭐" });
    }
    if (studyStreak >= 7) {
      achievements.push({ name: "Consistent", description: "7-day study streak", icon: "🔥" });
    }
    if (userStats.totalQuestionsAnswered >= 100) {
      achievements.push({ name: "Question Master", description: "Answered 100+ questions", icon: "🧠" });
    }

    // Calculate category performance
    const categoryPerformance = userStats.categoryStats || [];

    res.json({
      stats: {
        totalQuestionsAnswered: userStats.totalQuestionsAnswered,
        totalSessionsCompleted: userStats.totalSessionsCompleted,
        totalTimeSpent: userStats.totalTimeSpent,
        averageScore: userStats.averageScore,
        highestScore: userStats.highestScore,
        lowestScore: userStats.lowestScore,
      },
      categoryPerformance,
      recentSessions,
      performanceOverTime,
      categoryTrends,
      dailyStats,
      weaknesses,
      studyStreak,
      achievements,
    });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

export const getSessionById = async (req: AuthRequest, res: Response) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user?.id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ message: "Failed to load session" });
  }
};


// ------------------------------
// GET RESOURCES (FINAL FIX)
// ------------------------------
export const getResources = async (req: Request, res: Response) => {
  try {
    const { category, type, difficulty } = req.query;

    // 🔥 IMPORTANT: only active resources
    let query: any = { isActive: true };

    if (category && category !== "all") query.category = category;
    if (type && type !== "all") query.type = type;
    if (difficulty && difficulty !== "all") query.difficulty = difficulty;

    const resources = await StudyResource.find(query).sort({
      createdAt: -1,
    });

    return res.json({ resources });
  } catch (err: any) {
    console.error("Failed to fetch resources:", err);
    return res.status(500).json({
      message: "Failed to fetch resources",
    });
  }
};


// ------------------------------
// GET LEADERBOARDS
// ------------------------------
export const getLeaderboards = async (req: AuthRequest, res: Response) => {
  try {
    const { sort = 'overall' } = req.query;
    let sortCriteria: any = {};

    switch (sort) {
      case 'overall':
        sortCriteria = { averageScore: -1 };
        break;
      case 'sessions':
        sortCriteria = { totalSessionsCompleted: -1 };
        break;
      case 'streak':
        sortCriteria = { longestStreak: -1 };
        break;
      default:
        sortCriteria = { averageScore: -1 };
    }

    const leaderboards = await UserStats.find({})
      .populate('user', 'username email')
      .sort(sortCriteria)
      .limit(50);

    res.json({ leaderboards });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};
const updateUserStats = async (userId: string, session: any) => {
  try {
    const userStats = await UserStats.findOne({ user: userId });
    if (!userStats) {
      // Create new stats if not exists
      await UserStats.create({
        user: userId,
        totalQuestionsAnswered: session.questions.length,
        totalSessionsCompleted: 1,
        totalTimeSpent: session.totalTimeSpent || 0,
        averageScore: session.totalScore / session.questions.length,
        highestScore: session.totalScore,
        lowestScore: session.totalScore,
      });
      return;
    }

    // Update existing stats
    userStats.totalQuestionsAnswered += session.questions.length;
    userStats.totalSessionsCompleted += 1;
    userStats.totalTimeSpent += session.totalTimeSpent || 0;

    const newAverage = ((userStats.averageScore * (userStats.totalSessionsCompleted - 1)) + (session.totalScore / session.questions.length)) / userStats.totalSessionsCompleted;
    userStats.averageScore = newAverage;

    if (session.totalScore > userStats.highestScore) {
      userStats.highestScore = session.totalScore;
    }
    if (session.totalScore < userStats.lowestScore) {
      userStats.lowestScore = session.totalScore;
    }

    await userStats.save();
  } catch (err) {
    console.error("Error updating user stats:", err);
  }
};

// ------------------------------
// EVALUATE USER'S ANSWER (AI)
// ------------------------------
export const evaluateUserAnswer = async (req: AuthRequest, res: Response) => {
  const { sessionId, questionIndex, answer } = req.body;

  const session = await InterviewSession.findById(sessionId);
  if (!session) return res.status(404).json({ message: "Session not found" });

  const questionObj = session.questions[questionIndex];

  const evaluation = await evaluateAnswer(
    questionObj.question,
    answer
  );

  questionObj.userAnswer = answer;
  questionObj.score = evaluation.score;
  questionObj.feedback = evaluation.feedback;

  session.totalScore += evaluation.score;

  if (questionIndex === session.questions.length - 1) {
    session.completed = true;
    // Update user statistics when session is completed
    await updateUserStats(session.user.toString(), session);
  }

  await session.save();

  res.json({
    success: true,
    score: evaluation.score,
    feedback: evaluation.feedback,
    completed: session.completed,
  });
};

// ------------------------------
// GET PERFORMANCE PREDICTIONS
// ------------------------------
export const getPerformancePredictions = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userStats = await UserStats.findOne({ user: userId });
    if (!userStats) {
      return res.json({
        predictions: {
          overallReadiness: 0,
          successProbability: 0,
          strengths: [],
          weaknesses: [],
          recommendations: ["Complete more interview sessions to get predictions"]
        }
      });
    }

    // Calculate performance metrics
    const totalSessions = userStats.totalSessionsCompleted;
    const averageScore = userStats.averageScore;
    const currentStreak = userStats.currentStreak;
    const longestStreak = userStats.longestStreak;

    // Simple prediction algorithm (can be enhanced with ML later)
    let successProbability = 0;
    let overallReadiness = 0;

    // Base calculations
    if (totalSessions >= 10) {
      successProbability = Math.min(averageScore * 0.8 + (currentStreak / longestStreak) * 20, 95);
      overallReadiness = Math.min(averageScore * 0.7 + (totalSessions / 20) * 30, 100);
    } else if (totalSessions >= 5) {
      successProbability = Math.min(averageScore * 0.6 + (currentStreak / 5) * 20, 75);
      overallReadiness = Math.min(averageScore * 0.5 + (totalSessions / 10) * 30, 80);
    } else {
      successProbability = Math.max(averageScore * 0.4, 10);
      overallReadiness = Math.max(averageScore * 0.3, 5);
    }

    // Analyze category performance
    const categoryPerformance = userStats.categoryStats || [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    categoryPerformance.forEach(cat => {
      if (cat.averageScore >= 75) {
        strengths.push(`${cat.category}: ${cat.averageScore.toFixed(1)}%`);
      } else if (cat.averageScore < 60) {
        weaknesses.push(`${cat.category}: ${cat.averageScore.toFixed(1)}%`);
      }
    });

    // Generate recommendations
    const recommendations = [];

    if (totalSessions < 5) {
      recommendations.push("Complete at least 5 interview sessions for better predictions");
    }

    if (averageScore < 70) {
      recommendations.push("Focus on improving answer quality and technical depth");
    }

    if (currentStreak < 3) {
      recommendations.push("Maintain a consistent practice streak");
    }

    if (weaknesses.length > 0) {
      recommendations.push(`Strengthen your knowledge in: ${weaknesses.slice(0, 2).join(", ")}`);
    }

    if (strengths.length > 2) {
      recommendations.push("Leverage your strengths in technical interviews");
    }

    // Difficulty analysis
    const difficultyStats = userStats.difficultyStats || [];
    const advancedPerformance = difficultyStats.find(d => d.difficulty === 'advanced');
    if (advancedPerformance && advancedPerformance.averageScore < 60) {
      recommendations.push("Practice more advanced-level questions");
    }

    res.json({
      predictions: {
        overallReadiness: Math.round(overallReadiness),
        successProbability: Math.round(successProbability),
        totalSessions,
        averageScore: Math.round(averageScore),
        currentStreak,
        longestStreak,
        strengths: strengths.slice(0, 3),
        weaknesses: weaknesses.slice(0, 3),
        recommendations: recommendations.slice(0, 4)
      }
    });

  } catch (err: any) {
    console.error("Error getting performance predictions:", err);
    res.status(500).json({ message: "Failed to get performance predictions" });
  }
};

// ------------------------------
// QUESTION BANKS SYSTEM
// ------------------------------

// Create a new question bank
export const createQuestionBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { title, description, category, difficulty, isPublic, questions } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }

    const questionBank = await QuestionBank.create({
      title: title.trim(),
      description: description?.trim(),
      category: category || 'technical',
      difficulty: difficulty || 'intermediate',
      isPublic: isPublic || false,
      creator: userId,
      questions: questions || []
    });

    res.status(201).json({
      message: "Question bank created successfully",
      bank: questionBank
    });

  } catch (err: any) {
    console.error("Error creating question bank:", err);
    res.status(500).json({ message: "Failed to create question bank" });
  }
};

// Get user's question banks
export const getMyQuestionBanks = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    const banks = await QuestionBank.find({ creator: userId })
      .sort({ createdAt: -1 });

    res.json({ banks });

  } catch (err: any) {
    console.error("Error getting question banks:", err);
    res.status(500).json({ message: "Failed to get question banks" });
  }
};

// Get public question banks
export const getPublicQuestionBanks = async (req: AuthRequest, res: Response) => {
  try {
    const banks = await QuestionBank.find({ isPublic: true })
      .populate('creator', 'username')
      .sort({ createdAt: -1 });

    res.json({ banks });

  } catch (err: any) {
    console.error("Error getting public question banks:", err);
    res.status(500).json({ message: "Failed to get public question banks" });
  }
};

// Get a specific question bank
export const getQuestionBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bankId } = req.params;

    const bank = await QuestionBank.findById(bankId);
    if (!bank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    // Check if user can access this bank
    if (!bank.isPublic && bank.creator.toString() !== userId) {
      return res.status(403).json({ message: "Access denied" });
    }

    res.json({ bank });

  } catch (err: any) {
    console.error("Error getting question bank:", err);
    res.status(500).json({ message: "Failed to get question bank" });
  }
};

// Update question bank visibility
export const updateQuestionBankVisibility = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bankId } = req.params;
    const { isPublic } = req.body;

    const bank = await QuestionBank.findOne({ _id: bankId, creator: userId });
    if (!bank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    bank.isPublic = isPublic;
    await bank.save();

    res.json({ message: "Visibility updated successfully", bank });

  } catch (err: any) {
    console.error("Error updating visibility:", err);
    res.status(500).json({ message: "Failed to update visibility" });
  }
};

// Add question to bank
export const addQuestionToBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bankId } = req.params;
    const { question, expectedAnswer, category, difficulty } = req.body;

    if (!question || !expectedAnswer) {
      return res.status(400).json({ message: "Question and expected answer are required" });
    }

    const bank = await QuestionBank.findOne({ _id: bankId, creator: userId });
    if (!bank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    bank.questions.push({
      question: question.trim(),
      expectedAnswer: expectedAnswer.trim(),
      category: category || 'technical',
      difficulty: difficulty || 'intermediate',
      createdAt: new Date()
    });

    await bank.save();

    res.json({ message: "Question added successfully", bank });

  } catch (err: any) {
    console.error("Error adding question:", err);
    res.status(500).json({ message: "Failed to add question" });
  }
};

// Delete question bank
export const deleteQuestionBank = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { bankId } = req.params;

    const bank = await QuestionBank.findOneAndDelete({ _id: bankId, creator: userId });
    if (!bank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    res.json({ message: "Question bank deleted successfully" });

  } catch (err: any) {
    console.error("Error deleting question bank:", err);
    res.status(500).json({ message: "Failed to delete question bank" });
  }
};

// Quick save question to bank (from interview)
export const quickSaveQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { question, category, difficulty, bankId } = req.body;

    if (!question || !bankId) {
      return res.status(400).json({ message: "Question and bank ID are required" });
    }

    // Find the question bank
    const bank = await QuestionBank.findOne({ _id: bankId, creator: userId });
    if (!bank) {
      return res.status(404).json({ message: "Question bank not found" });
    }

    // Check if question already exists in the bank
    const questionExists = bank.questions.some(q => q.question.trim().toLowerCase() === question.trim().toLowerCase());
    if (questionExists) {
      return res.status(400).json({ message: "Question already exists in this bank" });
    }

    // Add the question
    bank.questions.push({
      question: question.trim(),
      expectedAnswer: "Answer to be provided later", // Placeholder
      category: category || 'technical',
      difficulty: difficulty || 'intermediate',
      createdAt: new Date()
    });

    await bank.save();

    res.json({ message: "Question saved to bank successfully" });

  } catch (err: any) {
    console.error("Error saving question:", err);
    res.status(500).json({ message: "Failed to save question" });
  }
};




