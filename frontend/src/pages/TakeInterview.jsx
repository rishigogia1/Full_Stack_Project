import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/api";

export default function TakeInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [session, setSession] = useState(null);
  const [index, setIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [time, setTime] = useState(60);
  const [loading, setLoading] = useState(false);

  // Voice-to-text states
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef(null);

  // Question bank states
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [questionBanks, setQuestionBanks] = useState([]);
  const [savingQuestion, setSavingQuestion] = useState(false);

  const submit = useCallback(async () => {
    setLoading(true);
    // Stop speech recognition if active
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
    try {
      await api.post("/interview/evaluate", {
        sessionId: session._id,
        questionIndex: index,
        answer,
      });

      setAnswer("");
      setTime(60);

      if (index + 1 === session.questions.length) {
        navigate("/result", { state: { sessionId: session._id } });
      } else {
        setIndex(index + 1);
      }
    } catch (err) {
      console.error("Failed to submit answer:", err);
    } finally {
      setLoading(false);
    }
  }, [isListening, session, index, answer, navigate]);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/interview/${id}`);
        setSession(res.data.session);
      } catch (err) {
        console.error("Failed to fetch session:", err);
      }
    };
    fetchSession();
  }, [id]);

  useEffect(() => {
    if (time === 0) submit();
    const timer = setInterval(() => setTime((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [time, submit]);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      setSpeechSupported(true);
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          }
        }

        setAnswer(prevAnswer => prevAnswer + finalTranscript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  if (!session) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <p>Loading interview session...</p>
        </div>
      </div>
    );
  }

  const question = session.questions[index];
  const progress = ((index + 1) / session.questions.length) * 100;

  const toggleSpeechRecognition = () => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const fetchQuestionBanks = async () => {
    try {
      const res = await api.get("/interview/question-banks/my-banks");
      setQuestionBanks(res.data.banks);
    } catch (err) {
      console.error("Failed to fetch question banks:", err);
    }
  };

  const saveQuestionToBank = async (bankId) => {
    setSavingQuestion(true);
    try {
      await api.post(`/interview/question-banks/${bankId}/questions/quick-save`, {
        question: question.question,
        category: question.category || "custom",
        difficulty: question.difficulty || "intermediate",
      });
      setShowSaveModal(false);
      alert("Question saved to question bank successfully!");
    } catch (err) {
      console.error("Failed to save question:", err);
      alert("Failed to save question. Please try again.");
    } finally {
      setSavingQuestion(false);
    }
  };

  const openSaveModal = () => {
    fetchQuestionBanks();
    setShowSaveModal(true);
  };

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div className="card" style={{ width: 900, maxWidth: "95%" }}>
        {/* Progress Bar */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "12px"
          }}>
            <span style={{ fontSize: "18px", fontWeight: "600" }}>
              Question {index + 1} of {session.questions.length}
            </span>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "16px",
              fontWeight: "600",
              color: time <= 10 ? "#ef4444" : time <= 30 ? "#f59e0b" : "#10b981"
            }}>
              <span>⏱</span>
              <span>{time}s</span>
            </div>
          </div>
          <div style={{
            width: "100%",
            height: "8px",
            background: "rgba(71, 85, 105, 0.3)",
            borderRadius: "4px",
            overflow: "hidden"
          }}>
            <div style={{
              width: `${progress}%`,
              height: "100%",
              background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
              borderRadius: "4px",
              transition: "width 0.3s ease"
            }} />
          </div>
        </div>

        {/* Question */}
        <div style={{ marginBottom: "32px" }}>
          <h2 style={{
            fontSize: "24px",
            lineHeight: "1.4",
            margin: "0 0 24px 0",
            color: "#f1f5f9"
          }}>
            {question.question}
          </h2>

          {/* Answer Input Section */}
          <div style={{ position: "relative", marginBottom: "24px" }}>
            <textarea
              rows={6}
              placeholder="Type your answer here... Be specific and provide examples where possible."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              style={{
                width: "100%",
                resize: "vertical",
                minHeight: "120px",
                paddingRight: speechSupported ? "60px" : "16px"
              }}
            />

            {/* Voice-to-Text Button */}
            {speechSupported && (
              <button
                onClick={toggleSpeechRecognition}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "12px",
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: "none",
                  background: isListening ? "#ef4444" : "#3b82f6",
                  color: "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "16px",
                  transition: "all 0.2s ease",
                  boxShadow: isListening ? "0 0 20px rgba(239, 68, 68, 0.5)" : "0 2px 8px rgba(59, 130, 246, 0.3)"
                }}
                title={isListening ? "Stop voice input" : "Start voice input"}
              >
                {isListening ? "⏹️" : "🎤"}
              </button>
            )}
          </div>

          {/* Voice Status */}
          {speechSupported && isListening && (
            <div style={{
              padding: "8px 12px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid #ef4444",
              borderRadius: "6px",
              color: "#ef4444",
              fontSize: "14px",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{ animation: "pulse 1s infinite" }}>🔴</span>
              Listening... Speak your answer
            </div>
          )}

          {!speechSupported && (
            <div style={{
              padding: "8px 12px",
              background: "rgba(245, 158, 11, 0.1)",
              border: "1px solid #f59e0b",
              borderRadius: "6px",
              color: "#f59e0b",
              fontSize: "14px",
              marginBottom: "16px"
            }}>
              🎤 Voice input not supported in this browser. Please use Chrome, Edge, or Safari.
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
          <div style={{ color: "#64748b", fontSize: "14px" }}>
            {answer.trim().length} characters
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <button
              onClick={openSaveModal}
              style={{
                padding: "12px 20px",
                fontSize: "14px",
                fontWeight: "600",
                background: "linear-gradient(135deg, #10b981, #059669)",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
              }}
              title="Save this question to your question bank"
            >
              💾 Save to Bank
            </button>
            <button
              onClick={submit}
              disabled={loading || !answer.trim()}
              style={{
                padding: "14px 32px",
                fontSize: "16px",
                fontWeight: "600",
                background: loading ? "#64748b" : "linear-gradient(135deg, #3b82f6, #06b6d4)",
                cursor: loading || !answer.trim() ? "not-allowed" : "pointer",
                opacity: loading || !answer.trim() ? 0.6 : 1
              }}
            >
              {loading ? "Submitting..." : index + 1 === session.questions.length ? "Finish Interview" : "Next Question"}
            </button>
          </div>
        </div>

        {/* Timer Warning */}
        {time <= 10 && (
          <div style={{
            marginTop: "16px",
            padding: "12px",
            background: "rgba(239, 68, 68, 0.1)",
            border: "1px solid #ef4444",
            borderRadius: "8px",
            color: "#ef4444",
            fontSize: "14px",
            textAlign: "center",
            animation: "pulse 1s infinite"
          }}>
            ⏰ Time is running out! Submit your answer soon.
          </div>
        )}
      </div>

      {/* Save to Question Bank Modal */}
      {showSaveModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0, 0, 0, 0.8)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000,
          padding: "20px"
        }}>
          <div style={{
            background: "#1e293b",
            borderRadius: "12px",
            padding: "24px",
            width: "100%",
            maxWidth: "500px",
            border: "1px solid #334155"
          }}>
            <h3 style={{
              margin: "0 0 20px 0",
              color: "#f1f5f9",
              fontSize: "20px",
              fontWeight: "600"
            }}>
              💾 Save Question to Bank
            </h3>

            <div style={{
              marginBottom: "20px",
              padding: "16px",
              background: "#0f172a",
              borderRadius: "8px",
              border: "1px solid #334155"
            }}>
              <h4 style={{
                margin: "0 0 8px 0",
                color: "#e2e8f0",
                fontSize: "16px",
                fontWeight: "600"
              }}>
                Question:
              </h4>
              <p style={{
                margin: 0,
                color: "#cbd5e1",
                fontSize: "14px",
                lineHeight: "1.4"
              }}>
                {question.question}
              </p>
            </div>

            {questionBanks.length === 0 ? (
              <div style={{
                textAlign: "center",
                padding: "20px",
                color: "#64748b"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "16px" }}>📝</div>
                <p>You don't have any question banks yet.</p>
                <p style={{ fontSize: "14px", marginTop: "8px" }}>
                  Create one from the Question Banks page to save questions.
                </p>
              </div>
            ) : (
              <div style={{ marginBottom: "24px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "12px",
                  color: "#e2e8f0",
                  fontSize: "16px",
                  fontWeight: "600"
                }}>
                  Select Question Bank:
                </label>
                <div style={{
                  maxHeight: "200px",
                  overflowY: "auto",
                  border: "1px solid #334155",
                  borderRadius: "8px"
                }}>
                  {questionBanks.map((bank) => (
                    <button
                      key={bank._id}
                      onClick={() => saveQuestionToBank(bank._id)}
                      disabled={savingQuestion}
                      style={{
                        width: "100%",
                        padding: "12px 16px",
                        background: "transparent",
                        border: "none",
                        borderBottom: "1px solid #334155",
                        color: "#e2e8f0",
                        textAlign: "left",
                        cursor: savingQuestion ? "not-allowed" : "pointer",
                        transition: "background 0.2s ease",
                        opacity: savingQuestion ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (!savingQuestion) e.target.style.background = "#0f172a";
                      }}
                      onMouseLeave={(e) => {
                        if (!savingQuestion) e.target.style.background = "transparent";
                      }}
                    >
                      <div style={{ fontWeight: "600", marginBottom: "4px" }}>
                        {bank.name}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#64748b",
                        display: "flex",
                        justifyContent: "space-between"
                      }}>
                        <span>{bank.questions?.length || 0} questions</span>
                        <span>{bank.isPublic ? "Public" : "Private"}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "12px"
            }}>
              <button
                onClick={() => setShowSaveModal(false)}
                disabled={savingQuestion}
                style={{
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid #64748b",
                  borderRadius: "6px",
                  color: "#cbd5e1",
                  cursor: savingQuestion ? "not-allowed" : "pointer",
                  opacity: savingQuestion ? 0.6 : 1
                }}
              >
                Cancel
              </button>
              {questionBanks.length > 0 && (
                <button
                  onClick={() => navigate("/question-banks")}
                  style={{
                    padding: "10px 20px",
                    background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                    border: "none",
                    borderRadius: "6px",
                    color: "white",
                    cursor: "pointer",
                    fontWeight: "600"
                  }}
                >
                  Create New Bank
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Add CSS animations
const styles = `
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}
