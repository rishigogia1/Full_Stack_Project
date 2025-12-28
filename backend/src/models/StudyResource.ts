import mongoose, { Document, Schema } from "mongoose";

export interface IStudyResource extends Document {
  title: string;
  description: string;
  category: string;
  type: 'documentation' | 'tutorial' | 'video' | 'article' | 'course';
  url: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isActive: boolean;
  createdAt: Date;
}

const studyResourceSchema = new Schema<IStudyResource>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['technical', 'behavioral', 'system-design', 'data-structures', 'algorithms', 'frontend', 'backend', 'devops', 'general'],
    required: true
  },
  type: {
    type: String,
    enum: ['documentation', 'tutorial', 'video', 'article', 'course'],
    required: true
  },
  url: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  tags: [{ type: String }],
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

// Index for efficient searching
studyResourceSchema.index({ category: 1, difficulty: 1, type: 1 });
studyResourceSchema.index({ tags: 1 });

export default mongoose.model<IStudyResource>("StudyResource", studyResourceSchema);
