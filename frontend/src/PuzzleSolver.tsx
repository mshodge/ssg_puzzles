import { useState, useEffect } from "react";
import Pitch from "./components/Pitch";
import { API_URL } from "./config";

type PlayerState = {
  id: string;
  label: string;
  square: number;
  color: string;
  hasBall: boolean;
  locked?: boolean;
};

type PuzzleSolverProps = {
  puzzleId: string;
  onBack: () => void;
};

export default function PuzzleSolver({ puzzleId, onBack }: PuzzleSolverProps) {
  const [puzzle, setPuzzle] = useState<any>(null);
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ correct: boolean; solution_answer?: string | null } | null>(null);
  const [showingSolution, setShowingSolution] = useState(false);
  const [solutionPositions, setSolutionPositions] = useState<{ [playerId: string]: number }>({});
  const [showingHint, setShowingHint] = useState(false);

  useEffect(() => {
    fetchPuzzle();
  }, [puzzleId]);

  async function fetchPuzzle() {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/puzzles/${puzzleId}`);
      const data = await res.json();
      setPuzzle(data);

      // Initialize players from puzzle data
      const initialPlayers: PlayerState[] = Object.entries(data.teams)
        .flatMap(([_, team]: any) =>
          team.players.map((p: any) => ({
            id: p.label, // Use label (A1, B1, etc.) as id for matching with backend
            label: p.label.replace(/^[AB]/, ''), // Display just the number (1-4) instead of A1-B4
            square: p.start_square,
            color: team.color,
            hasBall: p.has_ball,
            locked: p.locked || false,
          }))
        );

      setPlayers(initialPlayers);

      // Fetch solution positions
      try {
        const solutionRes = await fetch(`${API_URL}/puzzles/${puzzleId}/solution`);
        if (solutionRes.ok) {
          const solutionData = await solutionRes.json();
          const solutionMap: { [playerId: string]: number } = {};
          solutionData.forEach((sol: any) => {
            const player = initialPlayers.find(p => p.id === sol.player_label);
            if (player) {
              solutionMap[player.id] = sol.square_id;
            }
          });
          setSolutionPositions(solutionMap);
        }
      } catch (error) {
        console.error("Error fetching solution:", error);
      }
    } catch (error) {
      console.error("Error fetching puzzle:", error);
    } finally {
      setLoading(false);
    }
  }

  async function submitSolution() {
    setSubmitting(true);
    setResult(null);

    try {
      // Get only players that moved from their starting position
      const movedPlayers = players.filter((p) => {
        const startSquare = Object.values(puzzle.teams)
          .flatMap((team: any) => team.players)
          .find((player: any) => player.id === p.id)?.start_square;
        return startSquare !== p.square;
      });

      const positions = movedPlayers.map((p) => ({
        player_label: p.id,
        square_id: p.square,
      }));

      const res = await fetch(`${API_URL}/puzzles/${puzzleId}/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ positions }),
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error("Error submitting solution:", error);
    } finally {
      setSubmitting(false);
    }
  }

  function toggleSolution() {
    setShowingSolution(!showingSolution);
  }

  function resetPuzzle() {
    setResult(null);
    setShowingSolution(false);
    fetchPuzzle();
  }

  const displayPlayers = showingSolution
    ? players.map(p => ({
        ...p,
        square: solutionPositions[p.id] || p.square
      }))
    : players;

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Loading puzzle...</p>
      </div>
    );
  }

  if (!puzzle) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <p>Puzzle not found</p>
        <button onClick={onBack} style={{ marginTop: 16, padding: "8px 16px" }}>
          Back to Puzzles
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px" }}>
      <div>
        <div style={{ display: "flex", gap: 12, marginBottom: 16 }}>
          <button
            onClick={onBack}
            style={{
              padding: "8px 16px",
              backgroundColor: "#64748b",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            ← Back to Puzzles
          </button>
          
          <button
            onClick={async () => {
              const url = `${window.location.origin}/puzzle/${puzzleId}`;
              const shareData = {
                title: puzzle.title,
                text: `Check out this football tactics puzzle: ${puzzle.title}`,
                url: url,
              };

              if (navigator.share) {
                try {
                  await navigator.share(shareData);
                } catch (err) {
                  if ((err as Error).name !== 'AbortError') {
                    console.error('Error sharing:', err);
                  }
                }
              } else {
                try {
                  await navigator.clipboard.writeText(url);
                  alert("Puzzle link copied to clipboard!");
                } catch (err) {
                  console.error('Error copying to clipboard:', err);
                  alert(`Share this link: ${url}`);
                }
              }
            }}
            style={{
              padding: "8px 16px",
              backgroundColor: "#0ea5e9",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            🔗 Share Puzzle
          </button>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h2 style={{ margin: "0 0 8px 0" }}>{puzzle.title}</h2>
          {puzzle.description && (
            <p style={{ margin: "0 0 12px 0", color: "#64748b" }}>
              {puzzle.description}
            </p>
          )}
          <div style={{ display: "flex", gap: 16, fontSize: 14, color: "#64748b" }}>
            <span>
              Mode: <strong>{puzzle.mode}</strong>
            </span>
            <span>
              Format: <strong>{puzzle.format}</strong>
            </span>
          </div>
        </div>

        {result && (
          <div
            style={{
              padding: 16,
              marginBottom: 16,
              borderRadius: 8,
              backgroundColor: result.correct ? "#dcfce7" : "#fee2e2",
              border: `2px solid ${result.correct ? "#16a34a" : "#dc2626"}`,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>
              {result.correct ? "✅" : "❌"}
            </div>
            <h3 style={{ margin: "0 0 8px 0", color: result.correct ? "#15803d" : "#991b1b" }}>
              {result.correct ? "Correct Solution!" : "Incorrect Solution"}
            </h3>
            <p style={{ margin: 0, color: result.correct ? "#166534" : "#7f1d1d" }}>
              {result.correct
                ? "Great job! You solved the puzzle correctly."
                : "Not quite right. Try again!"}
            </p>
            {result.correct && result.solution_answer && (
              <div style={{ 
                marginTop: 12, 
                padding: 12, 
                backgroundColor: "white", 
                borderRadius: 6,
                border: "1px solid #16a34a"
              }}>
                <strong style={{ color: "#15803d" }}>Solution Explanation:</strong>
                <p style={{ margin: "8px 0 0 0", color: "#166534" }}>{result.solution_answer}</p>
              </div>
            )}
          </div>
        )}

        <div style={{ marginBottom: 16 }}>
          <h3>Solve the Puzzle</h3>
          <p style={{ fontSize: 14, color: "#64748b" }}>
            Drag the players to their correct positions to solve the puzzle.
          </p>
          {puzzle.hint && (
            <div style={{ marginTop: 12 }}>
              <button
                onClick={() => setShowingHint(!showingHint)}
                style={{
                  padding: "8px 16px",
                  fontSize: 14,
                  backgroundColor: "#f59e0b",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                {showingHint ? "Hide Hint" : "Show Hint"}
              </button>
              {showingHint && (
                <div style={{
                  marginTop: 8,
                  padding: 12,
                  backgroundColor: "#fef3c7",
                  border: "1px solid #f59e0b",
                  borderRadius: 6
                }}>
                  <strong style={{ color: "#92400e" }}>Hint:</strong>
                  <p style={{ margin: "8px 0 0 0", color: "#78350f" }}>{puzzle.hint}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ maxWidth: 400, margin: "0 auto", marginBottom: 16 }}>
          <Pitch
            initialPlayers={displayPlayers}
            onPlayerMove={showingSolution ? undefined : setPlayers}
            canDrag={(playerId) => {
              if (showingSolution) return false;
              const player = players.find((p) => p.id === playerId);
              return !player?.locked;
            }}
            style={{ width: "100%", border: "1px solid #ccc", display: "block" }}
          />
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button
            onClick={submitSolution}
            disabled={submitting || showingSolution}
            style={{
              flex: 1,
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: submitting || showingSolution ? "#94a3b8" : "#10b981",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: submitting || showingSolution ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {submitting ? "Checking..." : "Submit Solution"}
          </button>
          <button
            onClick={toggleSolution}
            disabled={Object.keys(solutionPositions).length === 0}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: Object.keys(solutionPositions).length === 0 ? "#94a3b8" : showingSolution ? "#f59e0b" : "#3b82f6",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: Object.keys(solutionPositions).length === 0 ? "not-allowed" : "pointer",
              fontWeight: "bold",
            }}
          >
            {showingSolution ? "Hide Solution" : "Show Solution"}
          </button>
          <button
            onClick={resetPuzzle}
            style={{
              padding: "12px 24px",
              fontSize: 16,
              backgroundColor: "#64748b",
              color: "white",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
