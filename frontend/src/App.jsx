import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateSession from "./pages/CreateSession";
import MySessions from "./pages/MySessions";
import TakeInterview from "./pages/TakeInterview";
import InterviewResult from "./pages/InterviewResult";
import Analytics from "./pages/Analytics";
import Resources from "./pages/Resources";
import Leaderboards from "./pages/Leaderboards";
import QuestionBanks from "./pages/QuestionBanks";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-session" element={
          <ProtectedRoute>
            <Navbar />
            <CreateSession />
          </ProtectedRoute>
        } />
        <Route path="/my-sessions" element={
          <ProtectedRoute>
            <Navbar />
            <MySessions />
          </ProtectedRoute>
        } />
        <Route path="/take-interview/:id" element={
          <ProtectedRoute>
            <Navbar />
            <TakeInterview />
          </ProtectedRoute>
        } />
        <Route path="/result" element={
          <ProtectedRoute>
            <Navbar />
            <InterviewResult />
          </ProtectedRoute>
        } />
        <Route path="/analytics" element={
          <ProtectedRoute>
            <Navbar />
            <Analytics />
          </ProtectedRoute>
        } />
        <Route path="/resources" element={
          <ProtectedRoute>
            <Navbar />
            <Resources />
          </ProtectedRoute>
        } />
        <Route path="/leaderboards" element={
          <ProtectedRoute>
            <Navbar />
            <Leaderboards />
          </ProtectedRoute>
        } />
        <Route path="/question-banks" element={
          <ProtectedRoute>
            <Navbar />
            <QuestionBanks />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}
