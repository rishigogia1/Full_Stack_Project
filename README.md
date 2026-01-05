# Interview Prep Platform

An AI-powered interview preparation platform that revolutionizes technical interview practice with personalized questions, real-time evaluation, and comprehensive progress tracking.

![Platform Preview](https://via.placeholder.com/800x400/3b82f6/ffffff?text=Interview+Prep+Platform)

## 🚀 Features

### Core Functionality
- **AI-Generated Questions**: Dynamic question generation using advanced AI models
- **Real-time Evaluation**: Instant feedback with detailed scoring and improvement suggestions
- **Progress Analytics**: Comprehensive dashboard with performance metrics and trends
- **Session Management**: Create and manage multiple practice sessions with custom settings

### User Experience
- **Modern UI/UX**: Clean, intuitive interface with dark/light theme support
- **Mobile-First Design**: Fully responsive across all devices
- **Gamification**: Achievement system, streaks, and leaderboards for motivation
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

### Technical Features
- **Secure Authentication**: JWT-based auth with account protection
- **Real-time Updates**: Live session progress and timer functionality
- **Offline Support**: PWA capabilities for offline practice
- **Multi-format Questions**: Support for coding, system design, behavioral questions

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern React with concurrent features
- **Vite** - Fast build tool with HMR
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **Axios** - HTTP client with interceptors

### Backend
- **Node.js/Express** - Scalable server framework
- **TypeScript** - Type-safe development
- **MongoDB/Mongoose** - NoSQL database with ODM
- **JWT** - Secure authentication
- **OpenRouter API** - AI question generation

### DevOps & Deployment
- **Docker** - Containerization
- **PM2** - Process management
- **Nginx** - Reverse proxy
- **SSL/TLS** - Security certificates

## 📋 Prerequisites

- Node.js 18+
- MongoDB 5+
- Docker & Docker Compose
- Git

## 🚀 Quick Start

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/interview-prep-platform.git
   cd interview-prep-platform
   ```

2. **Start MongoDB**
   ```bash
   docker run -d --name mongodb -p 27017:27017 mongo
   ```

3. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run seed          # Seed initial data
   npm run dev
   ```

4. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

### Production Deployment

1. **Build and deploy**
   ```bash
   # Backend
   cd backend
   npm run build
   npm start

   # Frontend
   cd frontend
   npm run build
   # Serve dist/ with your web server
   ```

2. **Docker deployment**
   ```bash
   docker-compose up -d
   ```

## 📁 Project Structure

```
interview-prep-platform/
├── backend/                 # Node.js/Express API server
│   ├── src/
│   │   ├── controllers/     # Route handlers
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Custom middleware
│   │   └── config/         # Configuration files
│   └── package.json
├── frontend/                # React SPA
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utilities
│   │   └── assets/        # Static assets
│   └── package.json
├── docker-compose.yml       # Docker orchestration
├── .github/                # GitHub Actions & Copilot instructions
└── README.md
```

## 🔧 Configuration

### Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env)**
```env
MONGO_URI=mongodb://localhost:27017/interviewprep
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-refresh-secret-key
OPENROUTER_API_KEY=your-openrouter-api-key
HF_API_KEY=your-huggingface-api-key
PORT=5000
NODE_ENV=development
```

**Frontend (.env.local)**
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 📊 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Token refresh

### Interview Endpoints
- `POST /api/interview/create` - Create new session
- `GET /api/interview/sessions` - Get user sessions
- `POST /api/interview/submit` - Submit answer

### Analytics Endpoints
- `GET /api/analytics/overview` - User statistics
- `GET /api/analytics/progress` - Progress tracking

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation
- Ensure responsive design

## 📈 Roadmap

- [ ] Advanced AI evaluation models
- [ ] Video interview practice
- [ ] Collaborative study groups
- [ ] Integration with coding platforms
- [ ] Mobile app development
- [ ] Multi-language support

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- OpenRouter for AI API access
- HuggingFace for inference services
- React and Vite communities
- All contributors and users
- 
**Made with ❤️ for interview preparation**
