# Interview Prep Platform - Frontend

A modern React-based frontend for an AI-powered interview preparation platform that helps users practice technical interviews with personalized questions and real-time evaluation.

## Features

- 🎯 **AI-Generated Questions**: Powered by OpenRouter API for dynamic, topic-specific interview questions
- 📊 **Real-time Evaluation**: Instant feedback on answers with scoring and improvement suggestions
- 📈 **Progress Analytics**: Track performance across sessions with detailed statistics
- 🎨 **Modern UI**: Clean, responsive design with dark/light theme support
- 📱 **Mobile-First**: Optimized for all devices with touch-friendly interactions
- 🔐 **Secure Authentication**: JWT-based auth with account lockout protection
- 🏆 **Gamification**: Achievement system and leaderboards for motivation
- 📚 **Study Resources**: Curated collection of learning materials by category

## Tech Stack

- **Framework**: React 19 with Vite
- **Styling**: Tailwind CSS with custom components
- **Routing**: React Router DOM
- **HTTP Client**: Axios with interceptors
- **State Management**: React hooks
- **Build Tool**: Vite with SWC compiler

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd interview-prep-platform/frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:5173](http://localhost:5173) in your browser

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx      # Navigation component
│   └── ProtectedRoute.jsx # Route protection
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── CreateSession.jsx # Session creation
│   └── ...
├── utils/              # Utility functions
│   └── api.js          # API client configuration
└── assets/             # Static assets
```

## Environment Variables

Create a `.env.local` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## Contributing

1. Follow the existing code style
2. Use meaningful commit messages
3. Test your changes thoroughly
4. Update documentation as needed

## License

This project is licensed under the ISC License.
