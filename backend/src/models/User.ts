import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  failedAttempts: number;
  lockUntil: Date | null;
  refreshToken?: string;
  // Statistics for analytics dashboard
  totalQuestionsAnswered: number;
  totalSessionsCompleted: number;
  averageScore: number;
  totalTimeSpent: number; // in minutes
  streakDays: number;
  lastPracticeDate: Date;
  // Preferences
  preferredCategories: string[];
  preferredDifficulty: 'beginner' | 'intermediate' | 'advanced';
  // Social features
  achievements: string[];
  level: number;
  experiencePoints: number;
  comparePassword(candidate: string): Promise<boolean>;
  isLocked(): boolean;
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6, select: false },
  failedAttempts: { type: Number, default: 0 },
  lockUntil: { type: Date, default: null },
  refreshToken: { type: String },
  // Statistics for analytics dashboard
  totalQuestionsAnswered: { type: Number, default: 0 },
  totalSessionsCompleted: { type: Number, default: 0 },
  averageScore: { type: Number, default: 0 },
  totalTimeSpent: { type: Number, default: 0 }, // in minutes
  streakDays: { type: Number, default: 0 },
  lastPracticeDate: { type: Date, default: null },
  // Preferences
  preferredCategories: { type: [String], default: [] },
  preferredDifficulty: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'intermediate' },
  // Social features
  achievements: { type: [String], default: [] },
  level: { type: Number, default: 1 },
  experiencePoints: { type: Number, default: 0 },
});

// Hash password automatically
userSchema.pre("save", async function (this: any) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.isLocked = function (): boolean {
  return !!(this.lockUntil && this.lockUntil > new Date());
};

export default mongoose.model<IUser>("User", userSchema);
