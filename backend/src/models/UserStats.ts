import mongoose, { Document, Schema } from "mongoose";

export interface IUserStats extends Document {
  user: mongoose.Types.ObjectId;
  // Overall statistics
  totalQuestionsAnswered: number;
  totalSessionsCompleted: number;
  totalTimeSpent: number; // in minutes
  averageScore: number;
  highestScore: number;
  lowestScore: number;

  // Category performance
  categoryStats: {
    category: string;
    questionsAnswered: number;
    averageScore: number;
    bestScore: number;
    totalTime: number;
  }[];

  // Difficulty performance
  difficultyStats: {
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    questionsAnswered: number;
    averageScore: number;
    sessionsCount: number;
  }[];

  // Progress tracking
  dailyStats: {
    date: Date;
    questionsAnswered: number;
    timeSpent: number;
    averageScore: number;
    sessionsCompleted: number;
  }[];

  // Achievements and milestones
  achievements: {
    id: string;
    name: string;
    description: string;
    unlockedAt: Date;
    icon: string;
  }[];

  // Streaks and consistency
  currentStreak: number;
  longestStreak: number;
  lastPracticeDate: Date;

  // Learning insights
  weakTopics: string[];
  strongTopics: string[];
  improvementAreas: string[];

  lastUpdated: Date;
}

const userStatsSchema = new Schema<IUserStats>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

  // Overall statistics
  totalQuestionsAnswered: { type: Number, default: 0 },
  totalSessionsCompleted: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  highestScore: { type: Number, default: 0 },
  lowestScore: { type: Number, default: 100 },

  // Category performance
  categoryStats: [{
    category: { type: String, required: true },
    questionsAnswered: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    bestScore: { type: Number, default: 0 },
    totalTime: { type: Number, default: 0 }
  }],

  // Difficulty performance
  difficultyStats: [{
    difficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      required: true
    },
    questionsAnswered: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    sessionsCount: { type: Number, default: 0 }
  }],

  // Progress tracking (last 30 days)
  dailyStats: [{
    date: { type: Date, required: true },
    questionsAnswered: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    sessionsCompleted: { type: Number, default: 0 }
  }],

  // Achievements and milestones
  achievements: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    icon: { type: String, required: true }
  }],

  // Streaks and consistency
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  lastPracticeDate: { type: Date },

  // Learning insights
  weakTopics: [{ type: String }],
  strongTopics: [{ type: String }],
  improvementAreas: [{ type: String }],

  lastUpdated: { type: Date, default: Date.now }
});

// Indexes for performance
userStatsSchema.index({ 'dailyStats.date': 1 });

export default mongoose.model<IUserStats>("UserStats", userStatsSchema);
