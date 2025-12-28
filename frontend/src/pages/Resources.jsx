import { useState, useEffect } from "react";
import api from "../utils/api";

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: 'all',
    type: 'all',
    difficulty: 'all'
  });

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const queryParams = new URLSearchParams();
        if (filters.category !== 'all') queryParams.append('category', filters.category);
        if (filters.type !== 'all') queryParams.append('type', filters.type);
        if (filters.difficulty !== 'all') queryParams.append('difficulty', filters.difficulty);

        const res = await api.get(`/interview/resources?${queryParams}`);
        setResources(res.data.resources || []);
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [filters]);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'technical', label: 'Technical' },
    { value: 'behavioral', label: 'Behavioral' },
    { value: 'system-design', label: 'System Design' },
    { value: 'data-structures', label: 'Data Structures' },
    { value: 'algorithms', label: 'Algorithms' },
    { value: 'frontend', label: 'Frontend' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
  ];

  const types = [
    { value: 'all', label: 'All Types' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'video', label: 'Video' },
    { value: 'article', label: 'Article' },
    { value: 'course', label: 'Course' },
  ];

  const difficulties = [
    { value: 'all', label: 'All Levels' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#64748b';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'documentation': return '📚';
      case 'tutorial': return '🎓';
      case 'video': return '🎥';
      case 'article': return '📄';
      case 'course': return '🎓';
      default: return '🔗';
    }
  };

  if (loading) {
    return (
      <div className="center" style={{ paddingTop: "80px" }}>
        <div className="card" style={{ width: 600, textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📚</div>
          <p>Loading study resources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="center" style={{ paddingTop: "80px" }}>
      <div style={{ width: "100%", maxWidth: "1200px", padding: "0 20px" }}>
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
            📚 Study Resources
          </h1>
          <p style={{ color: "#64748b", margin: 0 }}>
            Curated learning materials to boost your interview preparation
          </p>
        </div>

        {/* Filters */}
        <div className="card" style={{ padding: "24px", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "18px", marginBottom: "20px", color: "#f1f5f9" }}>
            🔍 Filter Resources
          </h3>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#f1f5f9"
              }}>
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => setFilters({...filters, category: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#f1f5f9",
                  fontSize: "14px"
                }}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#f1f5f9"
              }}>
                Type
              </label>
              <select
                value={filters.type}
                onChange={(e) => setFilters({...filters, type: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#f1f5f9",
                  fontSize: "14px"
                }}
              >
                {types.map(type => (
                  <option key={type.value} value={type.value}>{type.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "14px",
                fontWeight: "600",
                marginBottom: "8px",
                color: "#f1f5f9"
              }}>
                Difficulty
              </label>
              <select
                value={filters.difficulty}
                onChange={(e) => setFilters({...filters, difficulty: e.target.value})}
                style={{
                  width: "100%",
                  padding: "10px 12px",
                  borderRadius: "8px",
                  border: "1px solid rgba(71, 85, 105, 0.3)",
                  background: "rgba(15, 23, 42, 0.8)",
                  color: "#f1f5f9",
                  fontSize: "14px"
                }}
              >
                {difficulties.map(diff => (
                  <option key={diff.value} value={diff.value}>{diff.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Resources Grid */}
        {resources.length > 0 ? (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
            gap: "24px"
          }}>
            {resources.map((resource, index) => (
              <div
                key={index}
                className="card"
                style={{
                  padding: "24px",
                  cursor: "pointer",
                  transition: "transform 0.2s ease, box-shadow 0.2s ease"
                }}
                onClick={() => window.open(resource.url, '_blank')}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-4px)";
                  e.target.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.3)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "";
                }}
              >
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  marginBottom: "16px"
                }}>
                  <div style={{ fontSize: "32px" }}>
                    {getTypeIcon(resource.type)}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: "18px",
                      fontWeight: "600",
                      color: "#f1f5f9",
                      marginBottom: "4px"
                    }}>
                      {resource.title}
                    </div>
                    <div style={{
                      fontSize: "12px",
                      color: getDifficultyColor(resource.difficulty),
                      background: `rgba(${getDifficultyColor(resource.difficulty) === '#10b981' ? '16, 185, 129' : getDifficultyColor(resource.difficulty) === '#f59e0b' ? '245, 158, 11' : '239, 68, 68'}, 0.2)`,
                      padding: "2px 8px",
                      borderRadius: "12px",
                      display: "inline-block"
                    }}>
                      {resource.difficulty.charAt(0).toUpperCase() + resource.difficulty.slice(1)}
                    </div>
                  </div>
                </div>

                <p style={{
                  color: "#64748b",
                  fontSize: "14px",
                  lineHeight: "1.5",
                  marginBottom: "16px"
                }}>
                  {resource.description}
                </p>

                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}>
                  <div style={{
                    fontSize: "12px",
                    color: "#64748b",
                    textTransform: "capitalize"
                  }}>
                    {resource.category.replace('-', ' ')} • {resource.type}
                  </div>
                  <div style={{
                    fontSize: "14px",
                    color: "#3b82f6",
                    fontWeight: "500"
                  }}>
                    View Resource →
                  </div>
                </div>

                {resource.tags && resource.tags.length > 0 && (
                  <div style={{
                    marginTop: "16px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "6px"
                  }}>
                    {resource.tags.slice(0, 3).map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        style={{
                          fontSize: "11px",
                          color: "#64748b",
                          background: "rgba(71, 85, 105, 0.3)",
                          padding: "4px 8px",
                          borderRadius: "6px"
                        }}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{
            padding: "60px",
            textAlign: "center",
            background: "rgba(15, 23, 42, 0.6)"
          }}>
            <div style={{ fontSize: "64px", marginBottom: "24px" }}>📭</div>
            <h3 style={{ color: "#f1f5f9", marginBottom: "12px" }}>
              No resources found
            </h3>
            <p style={{ color: "#64748b", margin: 0 }}>
              Try adjusting your filters or check back later for new study materials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
