import { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { format, subDays, startOfDay } from 'date-fns';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, predictionsRes] = await Promise.all([
          api.get("/interview/analytics"),
          api.get("/interview/predictions")
        ]);
        setAnalytics(analyticsRes.data);
        setPredictions(predictionsRes.data.predictions);
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 80) return "#10b981";
    if (score >= 60) return "#f59e0b";
    return "#ef4444";
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const performanceOverTimeData = {
    labels: analytics?.performanceOverTime?.map(item => format(new Date(item.date), 'MMM dd')) || [],
    datasets: [
      {
        label: 'Score',
        data: analytics?.performanceOverTime?.map(item => item.score) || [],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const dailyActivityData = {
    labels: analytics?.dailyStats?.map(item => format(new Date(item.date), 'EEE')) || [],
    datasets: [
      {
        label: 'Questions',
        data: analytics?.dailyStats?.map(item => item.questions) || [],
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: '#10b981',
        borderWidth: 1,
      },
      {
        label: 'Sessions',
        data: analytics?.dailyStats?.map(item => item.sessions) || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: '#3b82f6',
        borderWidth: 1,
      },
    ],
  };

  const categoryData = {
    labels: analytics?.categoryPerformance?.map(cat => cat.category.replace('-', ' ')) || [],
    datasets: [
      {
        data: analytics?.categoryPerformance?.map(cat => cat.averageScore) || [],
        backgroundColor: [
          '#3b82f6',
          '#10b981',
          '#f59e0b',
          '#ef4444',
          '#8b5cf6',
          '#06b6d4',
        ],
        borderWidth: 2,
        borderColor: '#1e293b',
      },
    ],
  };

  if (loading) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div style={{ width: "100%", maxWidth: "1400px", padding: "0 20px" }}>
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
            📊 Analytics Dashboard
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Track your interview preparation progress and performance
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>
          {/* Total Questions */}
          <div className="card" style={{
            padding: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(6, 182, 212, 0.1))"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>❓</div>
            <div style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#3b82f6",
              marginBottom: "4px"
            }}>
              {analytics?.stats?.totalQuestionsAnswered || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>
              Questions Answered
            </div>
          </div>

          {/* Sessions Completed */}
          <div className="card" style={{
            padding: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1))"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎯</div>
            <div style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#10b981",
              marginBottom: "4px"
            }}>
              {analytics?.stats?.totalSessionsCompleted || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>
              Sessions Completed
            </div>
          </div>

          {/* Average Score */}
          <div className="card" style={{
            padding: "24px",
            textAlign: "center",
            background: `linear-gradient(135deg, rgba(${getScoreColor(analytics?.stats?.averageScore || 0) === '#10b981' ? '16, 185, 129' : getScoreColor(analytics?.stats?.averageScore || 0) === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.1), rgba(${getScoreColor(analytics?.stats?.averageScore || 0) === '#10b981' ? '5, 150, 105' : getScoreColor(analytics?.stats?.averageScore || 0) === '#f59e0b' ? '217, 119, 6' : '220, 38, 38'}, 0.1))`
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📈</div>
            <div style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: getScoreColor(analytics?.stats?.averageScore || 0),
              marginBottom: "4px"
            }}>
              {analytics?.stats?.averageScore?.toFixed(1) || 0}%
            </div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>
              Average Score
            </div>
          </div>

          {/* Study Streak */}
          <div className="card" style={{
            padding: "24px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(245, 101, 101, 0.1), rgba(220, 38, 38, 0.1))"
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>🔥</div>
            <div style={{
              fontSize: "32px",
              fontWeight: "bold",
              color: "#f87171",
              marginBottom: "4px"
            }}>
              {analytics?.studyStreak || 0}
            </div>
            <div style={{ color: "#64748b", fontSize: "14px" }}>
              Day Streak
            </div>
          </div>
        </div>

        {/* Performance Predictions */}
        {predictions && (
          <div className="card" style={{
            padding: "32px",
            marginBottom: "40px",
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.1))"
          }}>
            <h2 style={{
              fontSize: "28px",
              marginBottom: "24px",
              color: "#f1f5f9",
              textAlign: "center"
            }}>
              🎯 Interview Success Predictions
            </h2>

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {/* Overall Readiness */}
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(139, 92, 246, 0.3)"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>
                  {predictions.overallReadiness >= 80 ? "🚀" :
                   predictions.overallReadiness >= 60 ? "💪" :
                   predictions.overallReadiness >= 40 ? "📈" : "🎯"}
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: predictions.overallReadiness >= 80 ? "#10b981" :
                         predictions.overallReadiness >= 60 ? "#f59e0b" : "#ef4444",
                  marginBottom: "4px"
                }}>
                  {predictions.overallReadiness}%
                </div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Overall Readiness
                </div>
              </div>

              {/* Success Probability */}
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(168, 85, 247, 0.3)"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>
                  {predictions.successProbability >= 80 ? "🎉" :
                   predictions.successProbability >= 60 ? "✅" :
                   predictions.successProbability >= 40 ? "🤞" : "💭"}
                </div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: predictions.successProbability >= 80 ? "#10b981" :
                         predictions.successProbability >= 60 ? "#f59e0b" : "#ef4444",
                  marginBottom: "4px"
                }}>
                  {predictions.successProbability}%
                </div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Success Probability
                </div>
              </div>

              {/* Session Stats */}
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.3)"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🎯</div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#3b82f6",
                  marginBottom: "4px"
                }}>
                  {predictions.totalSessions}
                </div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Sessions Completed
                </div>
              </div>

              {/* Current Streak */}
              <div style={{
                textAlign: "center",
                padding: "20px",
                background: "rgba(255, 255, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(245, 158, 11, 0.3)"
              }}>
                <div style={{ fontSize: "48px", marginBottom: "8px" }}>🔥</div>
                <div style={{
                  fontSize: "32px",
                  fontWeight: "bold",
                  color: "#f59e0b",
                  marginBottom: "4px"
                }}>
                  {predictions.currentStreak}
                </div>
                <div style={{ color: "#64748b", fontSize: "14px" }}>
                  Current Streak
                </div>
              </div>
            </div>

            {/* Strengths & Weaknesses */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "24px",
              marginBottom: "32px"
            }}>
              {/* Strengths */}
              {predictions.strengths && predictions.strengths.length > 0 && (
                <div style={{
                  padding: "20px",
                  background: "rgba(16, 185, 129, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(16, 185, 129, 0.3)"
                }}>
                  <h3 style={{
                    fontSize: "18px",
                    marginBottom: "12px",
                    color: "#10b981",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    💪 Your Strengths
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {predictions.strengths.map((strength, index) => (
                      <li key={index} style={{ color: "#f1f5f9", marginBottom: "4px" }}>
                        {strength}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Weaknesses */}
              {predictions.weaknesses && predictions.weaknesses.length > 0 && (
                <div style={{
                  padding: "20px",
                  background: "rgba(239, 68, 68, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid rgba(239, 68, 68, 0.3)"
                }}>
                  <h3 style={{
                    fontSize: "18px",
                    marginBottom: "12px",
                    color: "#ef4444",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px"
                  }}>
                    🎯 Areas to Improve
                  </h3>
                  <ul style={{ margin: 0, paddingLeft: "20px" }}>
                    {predictions.weaknesses.map((weakness, index) => (
                      <li key={index} style={{ color: "#f1f5f9", marginBottom: "4px" }}>
                        {weakness}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendations */}
            {predictions.recommendations && predictions.recommendations.length > 0 && (
              <div style={{
                padding: "20px",
                background: "rgba(59, 130, 246, 0.1)",
                borderRadius: "12px",
                border: "1px solid rgba(59, 130, 246, 0.3)"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  marginBottom: "12px",
                  color: "#3b82f6",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  💡 Recommendations
                </h3>
                <ul style={{ margin: 0, paddingLeft: "20px" }}>
                  {predictions.recommendations.map((rec, index) => (
                    <li key={index} style={{ color: "#f1f5f9", marginBottom: "4px" }}>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Charts Section */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>
          {/* Performance Over Time */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
              📈 Performance Trend (Last 30 Days)
            </h3>
            {analytics?.performanceOverTime && analytics.performanceOverTime.length > 0 ? (
              <Line
                data={performanceOverTimeData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      titleColor: '#f1f5f9',
                      bodyColor: '#cbd5e1',
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      max: 100,
                      grid: { color: 'rgba(71, 85, 105, 0.3)' },
                      ticks: { color: '#64748b' },
                    },
                    x: {
                      grid: { color: 'rgba(71, 85, 105, 0.3)' },
                      ticks: { color: '#64748b' },
                    },
                  },
                }}
              />
            ) : (
              <div style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b"
              }}>
                Complete more sessions to see your performance trend.
              </div>
            )}
          </div>

          {/* Daily Activity */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
              📅 Daily Activity (Last 7 Days)
            </h3>
            <Bar
              data={dailyActivityData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: '#f1f5f9' },
                  },
                  tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1',
                  },
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    ticks: { color: '#64748b' },
                  },
                  x: {
                    grid: { color: 'rgba(71, 85, 105, 0.3)' },
                    ticks: { color: '#64748b' },
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Category Performance and Weaknesses */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
          gap: "24px",
          marginBottom: "40px"
        }}>
          {/* Category Performance */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
              🎯 Category Performance
            </h3>
            {analytics?.categoryPerformance && analytics.categoryPerformance.length > 0 ? (
              <Doughnut
                data={categoryData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: { color: '#f1f5f9' },
                    },
                    tooltip: {
                      backgroundColor: 'rgba(15, 23, 42, 0.9)',
                      titleColor: '#f1f5f9',
                      bodyColor: '#cbd5e1',
                      callbacks: {
                        label: (context) => `${context.label}: ${context.parsed.toFixed(1)}%`,
                      },
                    },
                  },
                }}
              />
            ) : (
              <div style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b"
              }}>
                Complete sessions in different categories to see performance breakdown.
              </div>
            )}
          </div>

          {/* Areas for Improvement */}
          <div className="card" style={{ padding: "24px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
              🎯 Areas for Improvement
            </h3>
            {analytics?.weaknesses && analytics.weaknesses.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {analytics.weaknesses.map((weakness, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "16px",
                      borderRadius: "12px",
                      background: "rgba(239, 68, 68, 0.1)",
                      border: "1px solid rgba(239, 68, 68, 0.3)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <div style={{
                        fontSize: "16px",
                        fontWeight: "600",
                        color: "#fca5a5",
                        marginBottom: "4px",
                        textTransform: "capitalize"
                      }}>
                        {weakness.category.replace('-', ' ')}
                      </div>
                      <div style={{
                        fontSize: "12px",
                        color: "#64748b"
                      }}>
                        Focus on improving this area
                      </div>
                    </div>
                    <div style={{
                      fontSize: "24px",
                      fontWeight: "bold",
                      color: "#ef4444"
                    }}>
                      {weakness.averageScore.toFixed(1)}%
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: "center",
                padding: "40px",
                color: "#64748b"
              }}>
                Great job! No major areas need improvement.
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        {analytics?.achievements && analytics.achievements.length > 0 && (
          <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
            <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
              🏆 Achievements
            </h3>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
              gap: "16px"
            }}>
              {analytics.achievements.map((achievement, index) => (
                <div
                  key={index}
                  style={{
                    padding: "20px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(217, 119, 6, 0.1))",
                    border: "1px solid rgba(245, 158, 11, 0.3)",
                    textAlign: "center"
                  }}
                >
                  <div style={{ fontSize: "32px", marginBottom: "12px" }}>
                    {achievement.icon}
                  </div>
                  <div style={{
                    fontSize: "16px",
                    fontWeight: "600",
                    color: "#f59e0b",
                    marginBottom: "4px"
                  }}>
                    {achievement.name}
                  </div>
                  <div style={{
                    fontSize: "12px",
                    color: "#64748b"
                  }}>
                    {achievement.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent Sessions */}
        <div className="card" style={{ padding: "24px" }}>
          <h3 style={{ fontSize: "20px", marginBottom: "20px", color: "#f1f5f9" }}>
            📅 Recent Sessions
          </h3>

          {analytics?.recentSessions && analytics.recentSessions.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {analytics.recentSessions.slice(0, 5).map((session, index) => (
                <div
                  key={index}
                  style={{
                    padding: "16px",
                    borderRadius: "8px",
                    background: "rgba(15, 23, 42, 0.4)",
                    border: "1px solid rgba(71, 85, 105, 0.2)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div>
                    <div style={{
                      fontSize: "16px",
                      fontWeight: "600",
                      color: "#f1f5f9",
                      marginBottom: "4px"
                    }}>
                      {session.topic}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: "#64748b"
                    }}>
                      {new Date(session.createdAt).toLocaleDateString()} • {session.questions?.length || 0} questions • {session.category}
                    </div>
                  </div>
                  <div style={{
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: getScoreColor(session.totalScore || 0)
                  }}>
                    {session.totalScore?.toFixed(1) || 0}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              textAlign: "center",
              padding: "40px",
              color: "#64748b"
            }}>
              No recent sessions found. Start practicing to see your progress here!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
