import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../config";

export default function AdminLogin() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pin }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error || "Incorrect PIN");
        return;
      }

      localStorage.setItem("adminPin", pin);
      navigate("/admin");
    } catch (err) {
      console.error("Admin login error:", err);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "500px",
          background: "#1b1b35",
          borderRadius: "20px",
          padding: "40px 30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
          color: "#fff",
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "56px", marginBottom: "10px" }}>🔐</div>

        <h1
          style={{
            margin: "0 0 12px 0",
            fontSize: "42px",
            fontWeight: "700",
          }}
        >
          Admin Access
        </h1>

        <p
          style={{
            marginBottom: "28px",
            color: "#a0a0c0",
            fontSize: "20px",
          }}
        >
          Enter your admin PIN to continue
        </p>

        <form onSubmit={handleLogin}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter PIN"
            required
            style={{
              width: "100%",
              padding: "18px 20px",
              borderRadius: "14px",
              border: "1px solid #2d2d4d",
              outline: "none",
              background: "#0d1025",
              color: "#fff",
              fontSize: "22px",
              marginBottom: "18px",
              boxSizing: "border-box",
            }}
          />

          {error && (
            <p
              style={{
                color: "#ff5f5f",
                marginBottom: "18px",
                fontSize: "18px",
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              borderRadius: "14px",
              border: "none",
              background: "#7c6cf3",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            marginTop: "22px",
            color: "#7f7f9a",
            fontSize: "18px",
          }}
        >
          Default PIN: 1234
        </p>
      </div>
    </div>
  );
}