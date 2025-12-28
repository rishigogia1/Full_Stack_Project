import { useState, useEffect } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function CreateSession() {
  const [topic, setTopic] = useState("");
  const [category, setCategory] = useState("technical");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [questionCount, setQuestionCount] = useState(5);
  const [timePerQuestion, setTimePerQuestion] = useState(60);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const navigate = useNavigate();

  // Form validation
  useEffect(() => {
    const isValid = topic.trim().length >= 3 && topic.trim().length <= 100;
    setIsFormValid(isValid);
    setError("");
  }, [topic, category, difficulty]);

  const categories = [
    { value: "technical", label: "Technical", icon: "💻", description: "Coding & technical skills" },
    { value: "behavioral", label: "Behavioral", icon: "🤝", description: "Soft skills & communication" },
    { value: "system-design", label: "System Design", icon: "🏗️", description: "Architecture & scalability" },
    { value: "data-structures", label: "Data Structures", icon: "📊", description: "DS & algorithms" },
    { value: "algorithms", label: "Algorithms", icon: "🧮", description: "Problem solving" },
    { value: "frontend", label: "Frontend", icon: "🎨", description: "UI/UX & web development" },
    { value: "backend", label: "Backend", icon: "⚙️", description: "Server-side development" },
    { value: "devops", label: "DevOps", icon: "🚀", description: "Deployment & infrastructure" },
    { value: "custom", label: "Custom", icon: "🎯", description: "Your own topic" },
  ];

  const difficulties = [
    { value: "beginner", label: "Beginner", color: "#10b981", description: "Basic concepts" },
    { value: "intermediate", label: "Intermediate", color: "#f59e0b", description: "Practical application" },
    { value: "advanced", label: "Advanced", color: "#ef4444", description: "Expert level" },
  ];

  const handleCreateSession = async () => {
    if (!isFormValid) {
      setError("Please enter a valid topic (3-100 characters)");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const sessionData = {
        topic: topic.trim(),
        category,
        difficulty,
        questionCount,
        timePerQuestion,
      };

      console.log("Creating session with:", sessionData);
      const response = await api.post("/interview/create", sessionData);
      console.log("Session created:", response.data);

      setSuccess("🎉 Session created successfully! Redirecting...");
      setTimeout(() => {
        navigate("/my-sessions");
      }, 1500);

    } catch (err) {
      console.error("Session creation failed:", err);
      const errorMessage = err.response?.data?.message || "Failed to create session. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getEstimatedDuration = () => {
    const totalSeconds = questionCount * timePerQuestion;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  };

  return (
    <div className="center" style={{
      paddingTop: "80px",
      background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      minHeight: "100vh"
    }}>
      <div className="card" style={{
        width: 700,
        maxWidth: "95%",
        borderRadius: "20px",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        border: "1px solid rgba(71, 85, 105, 0.3)",
        background: "rgba(15, 23, 42, 0.95)",
        backdropFilter: "blur(10px)",
        padding: "40px"
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{
            fontSize: "48px",
            marginBottom: "16px",
            animation: "bounce 2s infinite"
          }}>
            🎯
          </div>
          <h1 style={{
            fontSize: "36px",
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            fontWeight: "800"
          }}>
            Create Interview Session
          </h1>
          <p style={{ color: "#94a3b8", margin: 0, fontSize: "18px" }}>
            Customize your practice session with AI-powered questions
          </p>
        </div>

        {/* Success/Error Messages */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            color: "#ef4444",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>⚠️</span>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: "rgba(16, 185, 129, 0.1)",
            border: "1px solid #10b981",
            borderRadius: "12px",
            padding: "16px",
            marginBottom: "24px",
            color: "#10b981",
            fontSize: "14px",
            fontWeight: "500",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}>
            <span>✅</span>
            {success}
          </div>
        )}

        {/* Basic Settings */}
        <div style={{ marginBottom: "40px" }}>
          {/* Topic Input */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "12px",
              color: "#f1f5f9"
            }}>
              Interview Topic *
            </label>
            <div style={{ position: "relative" }}>
              <input
                placeholder="e.g., React Development, Data Structures, System Design..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                maxLength={100}
                style={{
                  width: "100%",
                  padding: "16px 20px",
                  borderRadius: "12px",
                  border: `2px solid ${topic.length >= 3 && topic.length <= 100 ? "rgba(59, 130, 246, 0.5)" : "rgba(71, 85, 105, 0.3)"}`,
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#f1f5f9",
                  fontSize: "16px",
                  outline: "none",
                  transition: "border-color 0.3s ease"
                }}
              />
              <div style={{
                position: "absolute",
                right: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: "12px"
              }}>
                {topic.length}/100
              </div>
            </div>
            <p style={{ color: "#64748b", fontSize: "14px", margin: "8px 0 0 0" }}>
              Be specific for better AI-generated questions
            </p>
          </div>

          {/* Category Selection */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#f1f5f9"
            }}>
              Category
            </label>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
              gap: "16px"
            }}>
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  style={{
                    padding: "16px 12px",
                    borderRadius: "12px",
                    border: `2px solid ${category === cat.value ? "#3b82f6" : "rgba(71, 85, 105, 0.3)"}`,
                    background: category === cat.value ? "rgba(59, 130, 246, 0.1)" : "rgba(15, 23, 42, 0.8)",
                    color: "#f1f5f9",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "8px",
                    textAlign: "center"
                  }}
                >
                  <span style={{ fontSize: "24px" }}>{cat.icon}</span>
                  <div>
                    <div style={{ fontWeight: "600" }}>{cat.label}</div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "4px" }}>
                      {cat.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div style={{ marginBottom: "32px" }}>
            <label style={{
              display: "block",
              fontSize: "18px",
              fontWeight: "600",
              marginBottom: "16px",
              color: "#f1f5f9"
            }}>
              Difficulty Level
            </label>
            <div style={{
              display: "flex",
              gap: "16px",
              flexWrap: "wrap"
            }}>
              {difficulties.map((diff) => (
                <button
                  key={diff.value}
                  onClick={() => setDifficulty(diff.value)}
                  style={{
                    padding: "16px 24px",
                    borderRadius: "12px",
                    border: `2px solid ${difficulty === diff.value ? diff.color : "rgba(71, 85, 105, 0.3)"}`,
                    background: difficulty === diff.value ? `rgba(${diff.color === "#10b981" ? "16, 185, 129" : diff.color === "#f59e0b" ? "245, 158, 11" : "239, 68, 68"}, 0.1)` : "rgba(15, 23, 42, 0.8)",
                    color: "#f1f5f9",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "500",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "4px",
                    minWidth: "120px"
                  }}
                >
                  <span style={{ fontWeight: "600" }}>{diff.label}</span>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>{diff.description}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Advanced Options Toggle */}
        <div style={{ marginBottom: "24px" }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              background: "none",
              border: "none",
              color: "#3b82f6",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transition: "color 0.2s ease"
            }}
            onMouseEnter={(e) => e.target.style.color = "#06b6d4"}
            onMouseLeave={(e) => e.target.style.color = "#3b82f6"}
          >
            <span style={{
              transform: showAdvanced ? "rotate(90deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            }}>▶</span>
            Advanced Options
          </button>
        </div>

        {/* Advanced Options */}
        {showAdvanced && (
          <div style={{
            marginBottom: "32px",
            padding: "24px",
            borderRadius: "16px",
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(71, 85, 105, 0.3)"
          }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "24px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#f1f5f9"
                }}>
                  Questions per Session
                </label>
                <select
                  value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    background: "rgba(15, 23, 42, 0.8)",
                    color: "#f1f5f9",
                    fontSize: "16px",
                    outline: "none"
                  }}
                >
                  {[3, 5, 7, 10, 15, 20].map(num => (
                    <option key={num} value={num}>{num} questions</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  fontSize: "16px",
                  fontWeight: "600",
                  marginBottom: "12px",
                  color: "#f1f5f9"
                }}>
                  Time per Question
                </label>
                <select
                  value={timePerQuestion}
                  onChange={(e) => setTimePerQuestion(Number(e.target.value))}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    borderRadius: "8px",
                    border: "1px solid rgba(71, 85, 105, 0.3)",
                    background: "rgba(15, 23, 42, 0.8)",
                    color: "#f1f5f9",
                    fontSize: "16px",
                    outline: "none"
                  }}
                >
                  {[30, 45, 60, 90, 120, 180, 300].map(time => (
                    <option key={time} value={time}>
                      {time < 60 ? `${time}s` : `${Math.floor(time/60)}m ${time%60}s`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Session Preview */}
            <div style={{
              marginTop: "24px",
              padding: "16px",
              borderRadius: "8px",
              background: "rgba(59, 130, 246, 0.1)",
              border: "1px solid rgba(59, 130, 246, 0.3)"
            }}>
              <h4 style={{ margin: "0 0 8px 0", color: "#3b82f6", fontSize: "14px" }}>
                📊 Session Preview
              </h4>
              <div style={{ color: "#bfdbfe", fontSize: "14px" }}>
                <div>• {questionCount} questions</div>
                <div>• {getEstimatedDuration()} total duration</div>
                <div>• {Math.round(timePerQuestion / 60 * 10) / 10} minutes per question</div>
              </div>
            </div>
          </div>
        )}

        {/* Create Button */}
        <button
          onClick={handleCreateSession}
          disabled={loading || !isFormValid}
          style={{
            width: "100%",
            padding: "20px",
            fontSize: "18px",
            fontWeight: "600",
            background: loading || !isFormValid ? "#64748b" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
            border: "none",
            borderRadius: "12px",
            color: "white",
            cursor: loading || !isFormValid ? "not-allowed" : "pointer",
            opacity: loading || !isFormValid ? 0.6 : 1,
            transition: "all 0.3s ease",
            boxShadow: loading || !isFormValid ? "none" : "0 4px 14px 0 rgba(59, 130, 246, 0.3)"
          }}
          onMouseEnter={(e) => {
            if (!loading && isFormValid) {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 8px 25px 0 rgba(59, 130, 246, 0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = loading || !isFormValid ? "none" : "0 4px 14px 0 rgba(59, 130, 246, 0.3)";
          }}
        >
          {loading ? (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "12px" }}>
              <span style={{
                width: "20px",
                height: "20px",
                border: "2px solid #ffffff",
                borderTop: "2px solid transparent",
                borderRadius: "50%",
                animation: "spin 1s linear infinite"
              }}></span>
              Creating Your Session...
            </span>
          ) : (
            <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <span>🚀</span>
              Create Interview Session
            </span>
          )}
        </button>

        {/* Tips */}
        <div style={{
          marginTop: "32px",
          padding: "20px",
          borderRadius: "12px",
          background: "rgba(59, 130, 246, 0.1)",
          border: "1px solid rgba(59, 130, 246, 0.3)"
        }}>
          <h4 style={{ margin: "0 0 12px 0", color: "#3b82f6", fontSize: "16px" }}>
            💡 Pro Tips for Better Practice
          </h4>
          <ul style={{
            margin: 0,
            paddingLeft: "20px",
            color: "#bfdbfe",
            fontSize: "14px",
            lineHeight: "1.6"
          }}>
            <li>Choose specific topics for more targeted questions</li>
            <li>Start with intermediate difficulty for balanced challenge</li>
            <li>Use advanced options to simulate real interview conditions</li>
            <li>Practice regularly to track improvement in analytics</li>
          </ul>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}
