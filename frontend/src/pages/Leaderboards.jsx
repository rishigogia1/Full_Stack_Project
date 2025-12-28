import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Leaderboards() {
  const [leaderboards, setLeaderboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('overall');

  useEffect(() => {
    const fetchLeaderboards = async () => {
      try {
        const res = await api.get(`/interview/leaderboards?sort=${sortBy}`);
        setLeaderboards(res.data.leaderboards || []);
      } catch (err) {
        console.error("Failed to fetch leaderboards:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboards();
  }, [sortBy]);

  const sortOptions = [
    { value: 'overall', label: 'Overall Score', icon: '🏆' },
    { value: 'sessions', label: 'Most Sessions', icon: '🎯' },
    { value: 'streak', label: 'Best Streak', icon: '🔥' },
  ];

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#ffd700';
      case 2: return '#c0c0c0';
      case 3: return '#cd7f32';
      default: return '#64748b';
    }
  };

  if (loading) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏆</div>
          <p>Loading leaderboards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div style={{ width: "100%", maxWidth: "1000px", padding: "0 20px" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{
            fontSize: "36px",
            margin: "0 0 8px 0",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            🏆 Leaderboards
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            See how you rank against other interview prep champions
          </p>
        </div>

        {/* Sort Options */}
        <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#f1f5f9" }}>
            📊 Sort By
          </h3>
          <div style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap"
          }}>
            {sortOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSortBy(option.value)}
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  border: `2px solid ${sortBy === option.value ? "#3b82f6" : "rgba(71, 85, 105, 0.3)"}`,
                  background: sortBy === option.value ? "rgba(59, 130, 246, 0.1)" : "rgba(15, 23, 42, 0.8)",
                  color: "#f1f5f9",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}
              >
                <span>{option.icon}</span>
                <span>{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Leaderboard Table */}
        {leaderboards.length > 0 ? (
          <div className="card" style={{ padding: "0" }}>
            <div style={{
              padding: "24px",
              borderBottom: "1px solid rgba(71, 85, 105, 0.3)"
            }}>
              <h3 style={{ fontSize: "20px", margin: 0, color: "#f1f5f9" }}>
                Top Performers
              </h3>
            </div>

            <div style={{ padding: "0" }}>
              {leaderboards.map((user, index) => {
                const rank = index + 1;
                return (
                  <div
                    key={user._id}
                    style={{
                      padding: "20px 24px",
                      borderBottom: index < leaderboards.length - 1 ? "1px solid rgba(71, 85, 105, 0.2)" : "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                      background: rank <= 3 ? `rgba(${rank === 1 ? '255, 215, 0' : rank === 2 ? '192, 192, 192' : '205, 127, 50'}, 0.1)` : "transparent"
                    }}
                  >
                    {/* Rank */}
                    <div style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: getRankColor(rank),
                      minWidth: "50px",
                      textAlign: "center"
                    }}>
                      {getRankIcon(rank)}
                    </div>

                    {/* User Info */}
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontSize: "18px",
                        fontWeight: "600",
                        color: "#f1f5f9",
                        marginBottom: "4px"
                      }}>
                        {user.name}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#64748b"
                      }}>
                        Level {user.level || 1} • {user.experiencePoints || 0} XP
                      </div>
                    </div>

                    {/* Stats */}
                    <div style={{
                      display: "flex",
                      gap: "24px",
                      textAlign: "center"
                    }}>
                      <div>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#f1f5f9"
                        }}>
                          {user.averageScore?.toFixed(1) || 0}%
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#64748b"
                        }}>
                          Avg Score
                        </div>
                      </div>

                      <div>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#f1f5f9"
                        }}>
                          {user.totalSessionsCompleted || 0}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#64748b"
                        }}>
                          Sessions
                        </div>
                      </div>

                      <div>
                        <div style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#f1f5f9"
                        }}>
                          {user.currentStreak || 0}
                        </div>
                        <div style={{
                          fontSize: "12px",
                          color: "#64748b"
                        }}>
                          Streak
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="card" style={{
            padding: "60px",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.6)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>🏆</div>
            <h3 style={{ color: "#f1f5f9", marginBottom: "12px" }}>
              No leaderboard data yet
            </h3>
            <p style={{ color: "#64748b", margin: 0 }}>
              Complete some interview sessions to see how you rank!
            </p>
          </div>
        )}

        {/* Achievement Section */}
        <div className="card" style={{
          padding: "24px",
          marginTop: "32px",
          background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))"
        }}>
          <h3 style={{ fontSize: "18px", marginBottom: "16px", color: "#f1f5f9" }}>
            🎖️ Achievement System
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🎯</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                First Session
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Complete your first interview
              </div>
            </div>

            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🔥</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                Streak Master
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Maintain a 7-day streak
              </div>
            </div>

            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>🏆</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                Perfect Score
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Achieve 100% in a session
              </div>
            </div>

            <div style={{
              padding: "16px",
              borderRadius: "12px",
              background: "rgba(15, 23, 42, 0.6)",
              textAlign: "center"
            }}>
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📚</div>
              <div style={{ fontSize: "14px", fontWeight: "600", color: "#f1f5f9" }}>
                Scholar
              </div>
              <div style={{ fontSize: "12px", color: "#64748b" }}>
                Complete 50 sessions
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
