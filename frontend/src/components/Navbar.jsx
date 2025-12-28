import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const navItems = [
    { path: "/create-session", label: "Create Session", icon: "🎯" },
    { path: "/my-sessions", label: "My Sessions", icon: "📋" },
    { path: "/analytics", label: "Analytics", icon: "📊" },
    { path: "/resources", label: "Resources", icon: "📚" },
    { path: "/leaderboards", label: "Leaderboards", icon: "🏆" },
    { path: "/question-banks", label: "Question Banks", icon: "📝" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      background: "rgba(15, 23, 42, 0.95)",
      backdropFilter: "blur(10px)",
      borderBottom: "1px solid rgba(71, 85, 105, 0.3)",
      zIndex: 1000,
      padding: "0 20px"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "70px"
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/my-sessions")}
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <span>🎯</span>
          <span>InterviewPrep</span>
        </div>

        {/* Desktop Navigation */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: isActive(item.path) ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: isActive(item.path) ? "#3b82f6" : "#f1f5f9",
                cursor: "pointer",
                fontSize: "14px",
                fontWeight: "500",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = "rgba(71, 85, 105, 0.2)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive(item.path)) {
                  e.target.style.background = "transparent";
                }
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "transparent",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s ease",
              marginLeft: "16px"
            }}
            onMouseEnter={(e) => {
              e.target.style.background = "rgba(239, 68, 68, 0.1)";
            }}
            onMouseLeave={(e) => {
              e.target.style.background = "transparent";
            }}
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{
            display: "none", // Hide on desktop, show on mobile with media queries
            background: "none",
            border: "none",
            color: "#f1f5f9",
            fontSize: "24px",
            cursor: "pointer",
            padding: "8px"
          }}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div style={{
          position: "absolute",
          top: "70px",
          left: 0,
          right: 0,
          background: "rgba(15, 23, 42, 0.98)",
          borderBottom: "1px solid rgba(71, 85, 105, 0.3)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px"
        }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setIsMenuOpen(false);
              }}
              style={{
                padding: "12px 16px",
                borderRadius: "8px",
                border: "none",
                background: isActive(item.path) ? "rgba(59, 130, 246, 0.2)" : "transparent",
                color: isActive(item.path) ? "#3b82f6" : "#f1f5f9",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: "500",
                textAlign: "left",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s ease"
              }}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <button
            onClick={() => {
              handleLogout();
              setIsMenuOpen(false);
            }}
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              background: "transparent",
              color: "#ef4444",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "500",
              marginTop: "8px",
              transition: "all 0.2s ease"
            }}
          >
            Logout
          </button>
        </div>
      )}

      {/* Mobile Styles */}
      <style>{`
        @media (max-width: 768px) {
          nav > div > div:nth-child(2) {
            display: none !important;
          }
          nav > div > button:last-child {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
}
