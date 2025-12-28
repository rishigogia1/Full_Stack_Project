import mongoose, { Document, Schema } from "mongoose";

export interface IQuestionBank extends Document {
  title: string;
  description?: string;
  category: string;
  difficulty: string;
  isPublic: boolean;
  creator: mongoose.Types.ObjectId;
  questions: {
    question: string;
    expectedAnswer: string;
    category: string;
    difficulty: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const QuestionBankSchema = new Schema<IQuestionBank>({
  title: { type: String, required: true },
  description: { type: String },
  category: {
    type: String,
    required: true,
    enum: ['technical', 'behavioral', 'system-design', 'data-structures', 'algorithms', 'frontend', 'backend', 'devops', 'custom'],
    default: 'technical'
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  isPublic: { type: Boolean, default: false },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: { type: String, required: true },
    expectedAnswer: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['technical', 'behavioral', 'system-design', 'data-structures', 'algorithms', 'frontend', 'backend', 'devops', 'custom']
    },
    difficulty: {
      type: String,
      required: true,
      enum: ['beginner', 'intermediate', 'advanced']
    },
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Index for efficient queries
QuestionBankSchema.index({ creator: 1, createdAt: -1 });
QuestionBankSchema.index({ isPublic: 1, createdAt: -1 });

export default mongoose.model<IQuestionBank>('QuestionBank', QuestionBankSchema);