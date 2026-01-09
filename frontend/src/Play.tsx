import { useState } from "react";
import Pitch from "./components/Pitch";

type PlayerState = {
  id: string;
  label: string;
  square: number;
  color: string;
  hasBall: boolean;
  team?: string;
  locked?: boolean;
  indicator?: string | null;
};

export default function Play() {
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
  // Center of pitch: 71/2 = 35.5, 100/2 = 50
  const centerBallPosition = { square: 32, x: 35.5, y: 50 };
  const [ballPosition, setBallPosition] = useState<{ square: number; x: number; y: number }>(centerBallPosition);

  function resetPlayers() {
    setPlayers(initialPlayers);
    setBallPosition(centerBallPosition);
  }

  function handleBallMove(square: number, x: number, y: number) {
    // Check if there's a player on this square
    const playerOnSquare = players.find(p => p.square === square);
    
    if (playerOnSquare) {
      // Snap to player's center position
      // Calculate player's center based on square
      const GRID_COLS = 7;
      const GRID_ROWS = 9;
      const col = (square - 1) % GRID_COLS;
      const row = Math.floor((square - 1) / GRID_COLS);
      const squareWidth = 71 / GRID_COLS;
      const squareHeight = 100 / GRID_ROWS;
      const centerX = col * squareWidth + squareWidth / 2;
      const centerY = row * squareHeight + squareHeight / 2;
      
      setBallPosition({ square, x: centerX, y: centerY });
    } else {
      // Place ball at dragged position
      setBallPosition({ square, x, y });
    }
  }

  function handlePlayerMove(updatedPlayers: PlayerState[]) {
    setPlayers(updatedPlayers);
    
    // Check if any player that moved was on the same square as the ball
    updatedPlayers.forEach(player => {
      const oldPlayer = players.find(p => p.id === player.id);
      if (oldPlayer && oldPlayer.square === ballPosition.square && player.square !== ballPosition.square) {
        // Player moved away from ball square, move ball with them to their new center
        const GRID_COLS = 7;
        const GRID_ROWS = 9;
        const col = (player.square - 1) % GRID_COLS;
        const row = Math.floor((player.square - 1) / GRID_COLS);
        const squareWidth = 71 / GRID_COLS;
        const squareHeight = 100 / GRID_ROWS;
        const centerX = col * squareWidth + squareWidth / 2;
        const centerY = row * squareHeight + squareHeight / 2;
        
        setBallPosition({ square: player.square, x: centerX, y: centerY });
      }
    });
  }

  return (
    <div style={{ padding: "40px 24px" }}>
      <div style={{ width: 900, maxWidth: "100%", margin: "0 auto" }}>
        <div style={{ 
          padding: "16px", 
          textAlign: "center"
        }}>
        <div style={{ textAlign: "center", marginBottom: 2 }}>
          <h2 style={{ margin: "0 0 8px 0", fontSize: 32, fontWeight: 700, color: "#1e293b" }}>Playground</h2>
          <p style={{ margin: 0, color: "#64748b", fontSize: 16 }}>Experiment with tactics and player positions</p>
        </div>
          <p style={{ margin: 0, color: "#0c4a6e", fontSize: 14 }}>
            Drag players and the ball anywhere on the pitch. Perfect for planning tactics!
          </p>
        </div>

        <div style={{ maxWidth: 500, margin: "0 auto 24px auto" }}>
          <Pitch 
            initialPlayers={players}
            onPlayerMove={handlePlayerMove}
            ballPosition={ballPosition}
            onBallMove={handleBallMove}
            style={{ 
              width: "100%", 
              border: "4px solid #FFD700", 
              borderRadius: 8,
              display: "block",
              boxShadow: "0 4px 12px rgba(255, 215, 0, 0.3)"
            }}
          />
        </div>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button 
            onClick={resetPlayers}
            style={{
              padding: "12px 32px",
              fontSize: 18,
              backgroundColor: "#64748b",
              color: "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              fontWeight: "bold",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
            }}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
