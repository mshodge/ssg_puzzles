import { useState } from "react";
import Pitch from "./components/Pitch";
import { API_URL } from "./config";

type PlayerState = {
  id: string;
  label: string;
  square: number;
  color: string;
  hasBall: boolean;
  team?: string;
  locked?: boolean;
};

export default function CreatePuzzle({ onCreated }: any) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [teamName, setTeamName] = useState("");
  const [hint, setHint] = useState("");
  const [solutionAnswer, setSolutionAnswer] = useState("");
  const [mode, setMode] = useState<"attacking" | "defending">("attacking");
  const [step, setStep] = useState<"starting" | "solution">("starting");
  const [createdPuzzle, setCreatedPuzzle] = useState<{ id: string; title: string; teamName: string } | null>(null);
  
  const initialPlayers: PlayerState[] = [
    { id: "A1", team: "A", label: "1", square: 11, color: "#ff0000", hasBall: true, locked: false },
    { id: "A2", team: "A", label: "2", square: 16, color: "#ff0000", hasBall: false, locked: false },
    { id: "A3", team: "A", label: "3", square: 20, color: "#ff0000", hasBall: false, locked: false },
    { id: "A4", team: "A", label: "4", square: 25, color: "#ff0000", hasBall: false, locked: false },
    { id: "B1", team: "B", label: "1", square: 53, color: "#0000ff", hasBall: false, locked: false },
    { id: "B2", team: "B", label: "2", square: 44, color: "#0000ff", hasBall: false, locked: false },
    { id: "B3", team: "B", label: "3", square: 48, color: "#0000ff", hasBall: false, locked: false },
    { id: "B4", team: "B", label: "4", square: 39, color: "#0000ff", hasBall: false, locked: false },
  ];

  const [players, setPlayers] = useState(initialPlayers);
  const [startingPositions, setStartingPositions] = useState<PlayerState[]>([]);

  function togglePlayerLock(playerId: string) {
    setPlayers(prev => prev.map(p => 
      p.id === playerId ? { ...p, locked: !p.locked } : p
    ));
  }

  function saveStartingPositions() {
    setStartingPositions([...players]);
    setStep("solution");
  }

  async function saveSolutionAndSubmit() {
    // Build solution positions from current player state
    const currentSolutionPositions = [...players];
    
    // Build payload with current solution positions
    const ballCarrier = startingPositions.find(p => p.hasBall) || players.find(p => p.hasBall);
    
    const submitPayload = {
      title,
      description,
      team_name: teamName,
      hint: hint || null,
      solution_answer: solutionAnswer || null,
      format: "4v4",
      mode,
      team_a_color: "#ff0000",
      team_b_color: "#0000ff",
      players: startingPositions.map(p => ({ 
        team: p.id.startsWith("A") ? "A" : "B", 
        label: p.id
      })),
      starting_positions: startingPositions.map(p => ({ player_label: p.id, square_id: p.square })),
      locked_positions: startingPositions
        .filter(p => p.locked)
        .map(p => ({ player_label: p.id, square_id: p.square })),
      solution_positions: currentSolutionPositions
        .filter(sp => {
          const start = startingPositions.find(st => st.id === sp.id);
          return start && start.square !== sp.square;
        })
        .map(p => ({ player_label: p.id, square_id: p.square })),
      ball_carrier_label: ballCarrier?.id || "A1"
    };
    
    // Submit puzzle immediately
    try {
      const res = await fetch(`${API_URL}/puzzles`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(submitPayload),
      });

      if (!res.ok) {
        const error = await res.text();
        console.error("Failed to create puzzle:", error);
        alert("Failed to create puzzle. Check console for details.");
        return;
      }

      const data = await res.json();
      console.log("Puzzle created:", data);
      setCreatedPuzzle({ id: data.id, title: data.title, teamName: data.team_name });
      if (onCreated) {
        onCreated(data.id);
      }
    } catch (error) {
      console.error("Error creating puzzle:", error);
      alert("Error creating puzzle. Check console for details.");
    }
  }

  function resetForm() {
    setTitle("");
    setDescription("");
    setTeamName("");
    setHint("");
    setSolutionAnswer("");
    setMode("attacking");
    setStep("starting");
    setPlayers(initialPlayers);
    setStartingPositions([]);
    setCreatedPuzzle(null);
  }

  if (createdPuzzle) {
    return (
      <div style={{ padding: "40px 24px", minHeight: "calc(100vh - 72px)"}}>
        <div style={{ width: 900, maxWidth: "100%", textAlign: "center", margin: "0 auto" }}>
          <div style={{ 
            backgroundColor: "#f0f9ff", 
            border: "2px solid #0ea5e9", 
            borderRadius: 12, 
            padding: 40,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
          }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h2 style={{ color: "#0c4a6e", marginBottom: 16 }}>Puzzle Created Successfully!</h2>
            <div style={{ 
              backgroundColor: "white", 
              padding: 24, 
              borderRadius: 8, 
              marginBottom: 24,
              textAlign: "left"
            }}>
              <p style={{ margin: "8px 0", fontSize: 16 }}>
                <strong>Puzzle Name:</strong> {createdPuzzle.title}
              </p>
              <p style={{ margin: "8px 0", fontSize: 16 }}>
                <strong>Puzzle ID:</strong> <code style={{ backgroundColor: "#f1f5f9", padding: "2px 8px", borderRadius: 4 }}>{createdPuzzle.id}</code>
              </p>
              <p style={{ margin: "8px 0", fontSize: 16 }}>
                <strong>Team:</strong> {createdPuzzle.teamName}
              </p>
            </div>
            <p style={{ color: "#475569", marginBottom: 24, fontSize: 14 }}>
              This puzzle has been added to <strong>{createdPuzzle.teamName}</strong>'s puzzle collection.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button 
                onClick={async () => {
                  const url = `${window.location.origin}/puzzle/${createdPuzzle.id}`;
                  const shareData = {
                    title: createdPuzzle.title,
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
                      alert("Puzzle link copied to clipboard! Share it with your team.");
                    } catch (err) {
                      console.error('Error copying to clipboard:', err);
                      alert(`Share this link: ${url}`);
                    }
                  }
                }}
                style={{ 
                  padding: "12px 24px", 
                  fontSize: 16, 
                  backgroundColor: "#10b981", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 6, 
                  cursor: "pointer",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: 8
                }}
              >
                🔗 Share Puzzle
              </button>
              <button 
                onClick={resetForm}
                style={{ 
                  padding: "12px 24px", 
                  fontSize: 16, 
                  backgroundColor: "#0ea5e9", 
                  color: "white", 
                  border: "none", 
                  borderRadius: 6, 
                  cursor: "pointer",
                  fontWeight: "bold"
                }}
              >
                Create Another Puzzle
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ width: 900, maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 32, fontWeight: 700, color: "#1e293b" }}>Create a new Tactics Puzzle</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>Design tactical challenges and share them with your team</p>
        </div>
        <input
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%", padding: 8, boxSizing: "border-box" }}
        />
        <input
          placeholder="Puzzle title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%", padding: 8, boxSizing: "border-box" }}
        />
        <textarea
          placeholder="Description (e.g. Goal kick, move Red Player 3 to a wide open space for a pass from Red Player 1)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%", padding: 8, minHeight: 80, boxSizing: "border-box" }}
        />
        <textarea
          placeholder="Hint (optional - shown to players when they click 'Show Hint')"
          value={hint}
          onChange={(e) => setHint(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%", padding: 8, minHeight: 60, boxSizing: "border-box" }}
        />
        <textarea
          placeholder="Solution Answer (optional - shown to players when they solve the puzzle correctly)"
          value={solutionAnswer}
          onChange={(e) => setSolutionAnswer(e.target.value)}
          style={{ display: "block", marginBottom: 12, width: "100%", padding: 8, minHeight: 60, boxSizing: "border-box" }}
        />

        <div style={{ marginBottom: 12 }}>
          <label style={{ display: "block", marginBottom: 4, fontWeight: "bold" }}>Mode:</label>
          <select 
            value={mode} 
            onChange={(e) => setMode(e.target.value as "attacking" | "defending")}
            style={{ padding: 8, fontSize: 14, width: "100%", boxSizing: "border-box" }}
          >
            <option value="attacking">Attacking</option>
            <option value="defending">Defending</option>
          </select>
        </div>

        {step === "starting" ? (
          <>
            <h3>Step 1: Set Starting Positions</h3>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
              Drag players to their starting positions. Double-click to lock/unlock players. Locked players will not be able to be moved during the puzzle. The ball carrier is always Red Player 1 (you cannot change this). Once you have moved the players to their start positions, click 'Save Starting Positions' to continue.
            </p>
            
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <Pitch 
                initialPlayers={players}
                onPlayerMove={setPlayers}
                onPlayerDoubleClick={togglePlayerLock}
                style={{ width: "100%", border: "1px solid #ccc", display: "block" }}
              />
            </div>
            
            <div style={{ marginTop: 20}}>
              <button 
                onClick={saveStartingPositions} 
                style={{ padding: "10px 20px", fontSize: 16, backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
              >
                Save Starting Positions
              </button>
            </div>
          </>
        ) : (
          <>
            <h3>Step 2: Set Solution Positions and Save Puzzle</h3>
            <p style={{ fontSize: 14, color: "#666", marginBottom: 12 }}>
              Drag players to their solution positions (locked players cannot be moved). Once you have moved the players to their solution positions, click 'Save Puzzle' to save the puzzle. Note, the solution must match exactly.
            </p>
            
            <div style={{ maxWidth: 400, margin: "0 auto" }}>
              <Pitch 
                initialPlayers={players}
                onPlayerMove={setPlayers}
                canDrag={(playerId) => {
                  const player = players.find(p => p.id === playerId);
                  return !player?.locked;
                }}
                style={{ width: "100%", border: "1px solid #ccc", display: "block" }}
              />
            </div>
            
            <div style={{ marginTop: 20, display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
              <button 
                onClick={() => setStep("starting")} 
                style={{ padding: "10px 20px", fontSize: 16, backgroundColor: "#999", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
              >
                Back to Starting Positions
              </button>
              <button 
                onClick={saveSolutionAndSubmit} 
                style={{ padding: "10px 20px", fontSize: 16, backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}
              >
                Save Puzzle
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
