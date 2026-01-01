import { useState } from "react";
import api from "../utils/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    setError("");

    try {
      // ✅ ONLY FIX: correct backend route
      const res = await api.post("/auth/login", { email, password });


      localStorage.setItem("token", res.data.accessToken);
      navigate("/my-sessions");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="center"
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <div
        className="card"
        style={{
          width: 420,
          maxWidth: "90%",
          borderRadius: "16px",
          boxShadow:
            "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
          border: "1px solid #e2e8f0",
          background: "white",
          padding: "40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "4px",
            background: "linear-gradient(90deg, #3b82f6, #06b6d4)",
          }}
        />

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              fontSize: "64px",
              marginBottom: "16px",
              background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              animation: "bounce 2s infinite",
            }}
          >
            🎯
          </div>

          <h2
            style={{
              margin: "0 0 8px 0",
              fontSize: "32px",
              fontWeight: "700",
              color: "#1e293b",
            }}
          >
            Welcome Back
          </h2>

          <p
            style={{
              color: "#64748b",
              margin: 0,
              fontSize: "16px",
            }}
          >
            Sign in to continue your interview preparation journey
          </p>
        </div>

        {error && (
          <div
            style={{
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
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            {error}
          </div>
        )}

        <div style={{ marginBottom: "20px" }}>
          <div style={{ position: "relative", marginBottom: "16px" }}>
            <span
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: "18px",
              }}
            >
              📧
            </span>

            <input
              type="email"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>

          <div style={{ position: "relative" }}>
            <span
              style={{
                position: "absolute",
                left: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "#64748b",
                fontSize: "18px",
              }}
            >
              🔒
            </span>

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 16px 16px 48px",
                border: "2px solid #e2e8f0",
                borderRadius: "12px",
                fontSize: "16px",
                outline: "none",
              }}
            />
          </div>
        </div>

        <button
          style={{
            width: "100%",
            marginBottom: "24px",
            padding: "16px",
            background: "linear-gradient(135deg, #3b82f6, #06b6d4)",
            color: "white",
            border: "none",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "600",
            cursor: "pointer",
          }}
          onClick={handleLogin}
          disabled={loading || !email || !password}
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#64748b" }}>Don't have an account? </span>
          <Link
            to="/register"
            style={{
              color: "#3b82f6",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Sign up
          </Link>
        </div>
      </div>

      <style>
        {`
          @keyframes bounce {
            0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-10px); }
            60% { transform: translateY(-5px); }
          }
        `}
      </style>
    </div>
  );
}
