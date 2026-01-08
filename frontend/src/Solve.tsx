import { useState, useEffect } from "react";
import { API_URL } from "./config";

type SolveProps = {
  onSelectPuzzle?: (puzzleId: string) => void;
};

export default function Solve({ onSelectPuzzle }: SolveProps) {
  const [teamName, setTeamName] = useState(() => localStorage.getItem("last_team_search") || "");
  const [puzzles, setPuzzles] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(() => Boolean(localStorage.getItem("last_team_search")));

  useEffect(() => {
    // Auto-search if there's a saved team name
    if (teamName.trim()) {
      searchPuzzles();
    }
  }, []);

  async function searchPuzzles() {
    if (!teamName.trim()) return;
    
    setLoading(true);
    setSearched(true);
    localStorage.setItem("last_team_search", teamName);
    
    try {
      const res = await fetch(`${API_URL}/puzzles?team_name=${encodeURIComponent(teamName)}`);
      const data = await res.json();
      setPuzzles(data);
    } catch (error) {
      console.error("Error fetching puzzles:", error);
      setPuzzles([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "40px 24px" }}>
      <div>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 32, fontWeight: 700, color: "#1e293b" }}>Solve Puzzles</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>Search for your team's tactical challenges</p>
        </div>
        
        <div style={{ 
          backgroundColor: "white", 
          padding: 32, 
          borderRadius: 12, 
          marginBottom: 32,
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0"
        }}>
          <label style={{ 
            display: "block", 
            marginBottom: 12, 
            fontWeight: 600, 
            fontSize: 15,
            color: "#334155"
          }}>
            🔍 Search by Team Name
          </label>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap"}}>
            <input
              placeholder="Enter your team name..."
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && searchPuzzles()}
              disabled={loading}
              style={{ 
                flex: 1, 
                padding: "14px 16px", 
                fontSize: 16, 
                borderRadius: 8,
                border: "2px solid #e2e8f0",
                boxSizing: "border-box",
                outline: "none",
                transition: "border-color 0.2s"
              }}
              onFocus={(e) => e.target.style.borderColor = "#667eea"}
              onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
            />
            <button 
              onClick={searchPuzzles}
              disabled={!teamName.trim() || loading}
              style={{ 
                padding: "14px 28px", 
                fontSize: 16, 
                fontWeight: 600,
                backgroundColor: teamName.trim() && !loading ? "#667eea" : "#cbd5e1", 
                color: "white", 
                border: "none", 
                borderRadius: 8,
                flexShrink: 0,
                width: "auto",
                cursor: teamName.trim() && !loading ? "pointer" : "not-allowed",
                transition: "all 0.2s",
                boxShadow: teamName.trim() && !loading ? "0 4px 12px rgba(102, 126, 234, 0.4)" : "none"
              }}
              onMouseEnter={(e) => {
                if (teamName.trim() && !loading) {
                  e.currentTarget.style.backgroundColor = "#5568d3";
                }
              }}
              onMouseLeave={(e) => {
                if (teamName.trim() && !loading) {
                  e.currentTarget.style.backgroundColor = "#667eea";
                }
              }}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </div>

        {loading && (
          <div style={{ 
            textAlign: "center", 
            padding: 60,
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
            <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>Searching for puzzles...</p>
          </div>
        )}

        {!loading && searched && puzzles.length === 0 && (
          <div style={{ 
            textAlign: "center", 
            padding: 60, 
            backgroundColor: "white",
            borderRadius: 12,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            border: "2px dashed #e2e8f0"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🤔</div>
            <h3 style={{ margin: "0 0 8px 0", fontSize: 20, color: "#1e293b" }}>
              No puzzles found
            </h3>
            <p style={{ fontSize: 16, color: "#64748b", margin: 0 }}>
              No puzzles found for team "{teamName}"
            </p>
            <p style={{ fontSize: 14, color: "#94a3b8", marginTop: 12 }}>
              Try a different team name or create a new puzzle
            </p>
          </div>
        )}

        {!loading && puzzles.length > 0 && (
          <div>
            <div style={{ 
              display: "flex", 
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              minWidth: 0
            }}>
              <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: "#1e293b", flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                Puzzles for {teamName}
              </h3>
              <span style={{ 
                padding: "6px 20px",
                backgroundColor: "#667eea",
                color: "white",
                borderRadius: 20,
                fontSize: 14,
                fontWeight: 600
              }}>
                {puzzles.length} {puzzles.length === 1 ? "puzzle" : "puzzles"}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {puzzles.map((puzzle) => (
                <div 
                  key={puzzle.id}
                  style={{ 
                    backgroundColor: "white",
                    padding: 24,
                    borderRadius: 12,
                    border: "1px solid #e2e8f0",
                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = "0 4px 16px rgba(0, 0, 0, 0.1)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.06)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <h4 style={{ margin: "0 0 8px 0", fontSize: 18, fontWeight: 600, color: "#1e293b" }}>
                    {puzzle.title}
                  </h4>
                  {puzzle.description && (
                    <p style={{ margin: "0 0 16px 0", color: "#64748b", fontSize: 15, lineHeight: 1.5 }}>
                      {puzzle.description}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
                    <span style={{ 
                      padding: "4px 12px",
                      backgroundColor: puzzle.mode === "attacking" ? "#dcfce7" : "#fed7aa",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: puzzle.mode === "attacking" ? "#166534" : "#9a3412"
                    }}>
                      📋 {puzzle.mode}
                    </span>
                    <span style={{ 
                      padding: "4px 12px",
                      backgroundColor: "#f1f5f9",
                      borderRadius: 6,
                      fontSize: 13,
                      fontWeight: 500,
                      color: "#475569"
                    }}>
                      ⚽ {puzzle.format}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      if (onSelectPuzzle) {
                        onSelectPuzzle(puzzle.id);
                      }
                    }}
                    style={{
                      padding: "10px 20px",
                      fontSize: 15,
                      fontWeight: 600,
                      backgroundColor: "#10b981",
                      color: "white",
                      border: "none",
                      borderRadius: 8,
                      cursor: "pointer",
                      transition: "all 0.2s",
                      boxShadow: "0 2px 8px rgba(16, 185, 129, 0.3)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#059669";
                      e.currentTarget.style.transform = "translateY(-1px)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#10b981";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    Solve Puzzle →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
