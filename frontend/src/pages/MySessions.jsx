import { useEffect, useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get("/interview/my-sessions");
        setSessions(res.data.sessions);
      } catch (err) {
        console.error("Failed to fetch sessions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSessions();
  }, []);

  if (loading) {
    return (
      <div className="center">
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "24px", marginBottom: "16px" }}>⏳</div>
          <p>Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div className="card" style={{ width: 900, maxWidth: "95%" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h2 style={{ margin: "0 0 8px 0", fontSize: "32px" }}>My Interview Sessions</h2>
            <p style={{ color: "#64748b", margin: 0 }}>
              {sessions.length} session{sessions.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <button
            onClick={() => navigate("/create-session")}
            style={{
              background: "linear-gradient(135deg, #10b981, #06b6d4)",
              border: "none",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "16px",
              transition: "transform 0.2s ease, opacity 0.2s"
            }}
            onMouseEnter={(e) => e.target.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.target.style.transform = "translateY(0)"}
          >
            + New Session
          </button>
        </div>

        {sessions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "48px 0" }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🎯</div>
            <h3 style={{ margin: "0 0 16px 0", color: "#64748b" }}>No sessions yet</h3>
            <p style={{ color: "#64748b", margin: "0 0 24px 0" }}>
              Create your first interview session to get started with practice questions.
            </p>
            <button
              onClick={() => navigate("/create-session")}
              style={{
                background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
                border: "none",
                color: "white",
                padding: "14px 28px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "16px"
              }}
            >
              Create Your First Session
            </button>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "16px" }}>
            {sessions.map((s) => (
              <div
                key={s._id}
                style={{
                  padding: "24px",
                  borderRadius: "16px",
                  background: "linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8))",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease",
                  backdropFilter: "blur(10px)"
                }}
                onClick={() => navigate(`/take-interview/${s._id}`)}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                  <div style={{ flex: 1, minWidth: "200px" }}>
                    <h3 style={{ margin: "0 0 8px 0", fontSize: "20px" }}>{s.topic}</h3>
                    <p style={{ color: "#64748b", margin: 0, fontSize: "14px" }}>
                      {s.questions?.length || 0} questions • {s.completed ? "Completed" : "In Progress"}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: s.totalScore >= 70 ? "#10b981" : s.totalScore >= 50 ? "#f59e0b" : "#ef4444"
                    }}>
                      {s.totalScore || 0}%
                    </div>
                    <div style={{ color: "#64748b", fontSize: "12px" }}>Score</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
