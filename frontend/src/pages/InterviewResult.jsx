import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../utils/api";

export default function InterviewResult() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await api.get(`/interview/${state.sessionId}`);
        setSession(res.data.session);
      } catch (err) {
        console.error("Failed to fetch results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [state.sessionId]);

  if (loading) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p>Loading your results...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <p>Failed to load results. Please try again.</p>
        </div>
      </div>
    );
  }

  const score = session.totalScore || 0;
  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const getScoreMessage = (score) => {
    if (score >= 80) return "Excellent! You're interview-ready!";
    if (score >= 60) return "Good job! Keep practicing to improve further.";
    return "Keep practicing! Every expert was once a beginner.";
  };

  const getScoreEmoji = (score) => {
    if (score >= 80) return "🎉";
    if (score >= 60) return "👍";
    return "💪";
  };

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div className="card" style={{ width: 900, maxWidth: "95%" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            fontSize: "64px",
            marginBottom: "16px",
            animation: "bounce 1s ease-in-out"
          }}>
            {getScoreEmoji(score)}
          </div>
          <h1 style={{
            fontSize: "36px",
            margin: "0 0 8px 0",
            background: `linear-gradient(135deg, ${getScoreColor(score)}, #06b6d4)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            Interview Completed!
          </h1>
          <p style={{ color: "#64748b", fontSize: "18px", margin: 0 }}>
            {getScoreMessage(score)}
          </p>
        </div>

        {/* Score Display */}
        <div style={{
          textAlign: "center",
          marginBottom: "40px",
          padding: "32px",
          background: `linear-gradient(135deg, rgba(${score >= 80 ? '16, 185, 129' : score >= 60 ? '245, 158, 11' : '239, 68, 68'}, 0.1), rgba(6, 182, 212, 0.1))`,
          borderRadius: "16px",
          border: `2px solid ${getScoreColor(score)}`
        }}>
          <div style={{
            fontSize: "72px",
            fontWeight: "bold",
            color: getScoreColor(score),
            marginBottom: "8px",
            textShadow: `0 0 20px ${getScoreColor(score)}40`
          }}>
            {score}%
          </div>
          <div style={{ color: "#64748b", fontSize: "16px" }}>
            Overall Score
          </div>
        </div>

        {/* Questions Review */}
        <div style={{ marginBottom: "32px" }}>
          <h3 style={{ fontSize: "24px", marginBottom: "20px", color: "#f1f5f9" }}>
            Question Review
          </h3>
          <div style={{ display: "grid", gap: "16px" }}>
            {session.questions.map((q, i) => (
              <div
                key={i}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: "12px",
                  flexWrap: "wrap",
                  gap: "12px"
                }}>
                  <h4 style={{
                    fontSize: "18px",
                    margin: "0",
                    color: "#f1f5f9",
                    flex: 1,
                    minWidth: "200px"
                  }}>
                    {q.question}
                  </h4>
                  <div style={{
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: q.score >= 7 ? "#10b981" : q.score >= 5 ? "#f59e0b" : "#ef4444",
                    background: `rgba(${q.score >= 7 ? '16, 185, 129' : q.score >= 5 ? '245, 158, 11' : '239, 68, 68'}, 0.2)`,
                    padding: "4px 12px",
                    borderRadius: "20px",
                    border: `1px solid ${q.score >= 7 ? '#10b981' : q.score >= 5 ? '#f59e0b' : '#ef4444'}`
                  }}>
                    {q.score || 0}/10
                  </div>
                </div>

                {q.userAnswer && (
                  <div style={{ marginBottom: "12px" }}>
                    <div style={{
                      fontSize: "14px",
                      color: "#64748b",
                      marginBottom: "4px",
                      fontWeight: "600"
                    }}>
                      Your Answer:
                    </div>
                    <div style={{
                      background: "rgba(71, 85, 105, 0.3)",
                      padding: "12px",
                      borderRadius: "8px",
                      color: "#e2e8f0",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}>
                      {q.userAnswer}
                    </div>
                  </div>
                )}

                {q.feedback && (
                  <div>
                    <div style={{
                      fontSize: "14px",
                      color: "#64748b",
                      marginBottom: "4px",
                      fontWeight: "600"
                    }}>
                      Feedback:
                    </div>
                    <div style={{
                      background: "rgba(59, 130, 246, 0.1)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      padding: "12px",
                      borderRadius: "8px",
                      color: "#bfdbfe",
                      fontSize: "14px",
                      lineHeight: "1.5"
                    }}>
                      {q.feedback}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          justifyContent: "center",
          gap: "16px",
          flexWrap: "wrap"
        }}>
          <button
            onClick={() => navigate("/my-sessions")}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #64748b, #475569)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            View All Sessions
          </button>
          <button
            onClick={() => navigate("/create-session")}
            style={{
              padding: "14px 28px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            Practice Another Topic
          </button>
        </div>
      </div>
    </div>
  );
}
