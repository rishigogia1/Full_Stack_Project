# AI Coding Agent Instructions for Interview Prep Platform

## Architecture Overview
This is a full-stack interview preparation platform with:
- **Backend**: Node.js/Express/TypeScript server with MongoDB (Mongoose) for data persistence
- **Frontend**: React SPA with Vite, React Router, and Tailwind CSS
- **AI Integration**: OpenRouter API for question generation (Llama model), HuggingFace for answer evaluation
- **Authentication**: JWT-based with refresh tokens, bcrypt password hashing, account lockout after failed attempts

Key data flows:
- User registers/logs in → JWT tokens stored in localStorage
- User creates interview session → AI generates questions via OpenRouter
- User answers questions → Rule-based scoring in `evaluationService.ts` (HuggingFace client initialized but not used)
- Results stored in MongoDB → Analytics dashboard shows progress/stats

## Developer Workflows
- **Start development**: Run `npm run dev` in both `backend/` and `frontend/` directories (backend on :5000, frontend on :5173)
- **Seed data**: `cd backend && npm run seed` to populate study resources in MongoDB
- **Build for production**: `npm run build` in both dirs, then `npm start` in backend
- **Debug backend**: Use VS Code Node.js debugger on `src/server.ts`
- **Debug frontend**: React DevTools in browser, Vite HMR for hot reload

## Project Conventions
- **Backend structure**: Controllers handle HTTP (`authController.ts`), services for business logic (`questionService.ts`), models for data (`User.ts`)
- **Error handling**: Global error handler in `middleware/validation.ts`, controllers return JSON with `message` field
- **Validation**: Use `express-validator` in routes, custom middleware in `middleware/validation.ts`
- **Auth middleware**: `authMiddleware.ts` checks JWT, attaches `req.user` (user ID)
- **Database**: Mongoose schemas with TypeScript interfaces (e.g., `IUser` in `User.ts`)
- **Frontend API calls**: Centralized in `utils/api.js` with automatic JWT attachment
- **Routing**: React Router with `ProtectedRoute` component wrapping authenticated pages
- **Styling**: Tailwind CSS classes directly in JSX, no CSS modules

## Integration Points
- **External APIs**: OpenRouter for question generation (requires `OPENROUTER_API_KEY`), HuggingFace (optional `HF_API_KEY`)
- **Database**: MongoDB connection via `config/database.ts`, URI from `MONGO_URI` or `MONGODB_URI` env var
- **Environment**: `.env` file for secrets, defaults provided in `server.ts` for development
- **Fallbacks**: Question generation falls back to mock data if API fails (see `questionService.ts`)

## Key Files to Reference
- `backend/src/server.ts`: Entry point, route mounting, middleware setup
- `backend/src/models/User.ts`: User schema with stats, preferences, gamification fields
- `backend/src/services/questionService.ts`: AI question generation with OpenRouter
- `frontend/src/App.jsx`: Route definitions and protected route wrapping
- `frontend/src/utils/api.js`: Axios instance with JWT interceptor

## Common Patterns
- **User creation**: Always create `UserStats` document alongside `User` (see `authController.ts`)
- **Session flow**: InterviewSession model links questions/answers, evaluated in `interviewController.ts`
- **Scoring**: 0-10 scale, strengths/improvements arrays (see `evaluationService.ts`)
- **Resource seeding**: Run `seedResources.ts` to populate study materials with categories/tags</content>
<parameter name="filePath">c:\Users\rishi\Desktop\Full Stack Project\interview-prep-platform\.github\copilot-instructions.md