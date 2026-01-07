import { useState } from "react";
import { API_URL } from "./config";

export default function UserSetup({ onReady }: { onReady: () => void }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit() {
    if (!name.trim()) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(name.trim()),
      });

      if (!res.ok) {
        throw new Error("Failed to register. Please try again.");
      }

      const data = await res.json();
      localStorage.setItem("user_id", data.user_id);
      localStorage.setItem("user_name", name.trim());
      onReady();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      padding: 24
    }}>
      <div style={{
        backgroundColor: "white",
        borderRadius: 16,
        padding: "48px 40px",
        maxWidth: 480,
        width: "100%",
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3)"
      }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            fontSize: 48,
            marginBottom: 16
          }}>⚽</div>
          <h1 style={{ 
            margin: "0 0 8px 0", 
            fontSize: 32, 
            color: "#1e293b",
            fontWeight: 700
          }}>
            Soccer Puzzle Coach
          </h1>
          <p style={{ 
            margin: 0, 
            color: "#64748b", 
            fontSize: 16,
            lineHeight: 1.5
          }}>
            Create and share tactical puzzles for your team
          </p>
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ 
            display: "block", 
            marginBottom: 8, 
            fontWeight: 600, 
            fontSize: 14,
            color: "#334155"
          }}>
            What's your name, coach?
          </label>
          <input
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && submit()}
            disabled={loading}
            style={{ 
              width: "100%",
              padding: "12px 16px",
              fontSize: 16,
              border: "2px solid #e2e8f0",
              borderRadius: 8,
              boxSizing: "border-box",
              transition: "border-color 0.2s",
              outline: "none"
            }}
            onFocus={(e) => e.target.style.borderColor = "#667eea"}
            onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
          />
        </div>

        {error && (
          <div style={{
            padding: 12,
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            marginBottom: 16,
            color: "#991b1b",
            fontSize: 14
          }}>
            {error}
          </div>
        )}

        <button 
          onClick={submit} 
          disabled={!name.trim() || loading}
          style={{
            width: "100%",
            padding: "14px 24px",
            fontSize: 16,
            fontWeight: 600,
            backgroundColor: name.trim() && !loading ? "#667eea" : "#cbd5e1",
            color: "white",
            border: "none",
            borderRadius: 8,
            cursor: name.trim() && !loading ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            boxShadow: name.trim() && !loading ? "0 4px 12px rgba(102, 126, 234, 0.4)" : "none"
          }}
          onMouseEnter={(e) => {
            if (name.trim() && !loading) {
              e.currentTarget.style.backgroundColor = "#5568d3";
              e.currentTarget.style.transform = "translateY(-1px)";
            }
          }}
          onMouseLeave={(e) => {
            if (name.trim() && !loading) {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
            }
          }}
        >
          {loading ? "Setting up..." : "Get Started"}
        </button>

        <p style={{
          marginTop: 24,
          textAlign: "center",
          fontSize: 13,
          color: "#94a3b8",
          lineHeight: 1.5
        }}>
          Your name will be used to identify the puzzles you create
        </p>
      </div>
    </div>
  );
}
