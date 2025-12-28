import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  answer: {
    type: String,
    default: "",
  },
  userAnswer: {
    type: String,
    default: "",
  },
  score: {
    type: Number,
    default: 0,
  },
  feedback: {
    type: String,
    default: "",
  },
});

const interviewSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  topic: {
    type: String,
    required: true,
  },

  // New fields for categories and difficulty
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'data-structures', 'algorithms', 'frontend', 'backend', 'devops', 'custom'],
    default: 'technical',
  },

  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },

  // Advanced customization options
  questionCount: {
    type: Number,
    default: 5,
    min: 1,
    max: 20,
  },

  timePerQuestion: {
    type: Number, // in seconds
    default: 60,
    min: 30,
    max: 300,
  },

  // For mixed topic sessions
  mixedTopics: [{
    topic: String,
    category: String,
    questionCount: Number,
  }],

  questions: [questionSchema],

  totalScore: {
    type: Number,
    default: 0,
  },

  completed: {
    type: Boolean,
    default: false,
  },

  // Analytics tracking
  totalTimeSpent: {
    type: Number, // in seconds
    default: 0,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "InterviewSession",
  interviewSessionSchema
);
