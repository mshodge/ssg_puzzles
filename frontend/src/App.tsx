// import { useEffect, useState } from "react";
// import Pitch from "./components/Pitch";

// function App() {
//   const [puzzle, setPuzzle] = useState<any>(null);

//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/puzzles/a691480d-efe2-4ead-9622-77b6865fb1fd")
//       .then((res) => res.json())
//       .then(setPuzzle);
//   }, []);

//   if (!puzzle) {
//     return <div>Loading puzzle...</div>;
//   }

//   return (
//     <div style={{ maxWidth: 600, margin: "0 auto" }}>
//       <h2>{puzzle.title}</h2>
//       <Pitch puzzle={puzzle} />
//     </div>
//   );
// }

// export default App;

import { useState, useEffect } from "react";
import CreatePuzzle from "./CreatePuzzle";
import Solve from "./Solve";
import PuzzleSolver from "./PuzzleSolver";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
      setSelectedPuzzleId(null);
    };
    
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function navigate(path: string) {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    setSelectedPuzzleId(null);
  }

  function selectPuzzle(puzzleId: string) {
    setSelectedPuzzleId(puzzleId);
  }

  return (
      <div className="container"
        style={{ // ← horizontal centering
          backgroundColor: "#f1f5f9",
        }}
      >
      <div
        style={{
          width: "100%",
        }}
      >
      <nav style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        padding: "16px 32px", 
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>⚽</span>
          <h1 style={{ 
            margin: 0, 
            fontSize: 20, 
            fontWeight: 700, 
            color: "white",
            letterSpacing: "-0.5px"
          }}>
            Fun Football Tactics Puzzles for Kids
          </h1>
        </div>
        
        <div style={{ display: "flex", gap: 12}}>
          <button
            onClick={() => navigate("/create")}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: currentPath === "/create" ? "white" : "rgba(255,255,255,0.2)",
              color: currentPath === "/create" ? "#667eea" : "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: currentPath === "/create" ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
            onMouseEnter={(e) => {
              if (currentPath !== "/create") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPath !== "/create") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }
            }}
          >
            Create Puzzle
          </button>
          <button
            onClick={() => navigate("/solve")}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: currentPath === "/solve" ? "white" : "rgba(255,255,255,0.2)",
              color: currentPath === "/solve" ? "#667eea" : "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: currentPath === "/solve" ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
            onMouseEnter={(e) => {
              if (currentPath !== "/solve") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPath !== "/solve") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }
            }}
          >
            Solve Puzzles
          </button>
        </div>
      </nav>

      <main
          style={{
            flex: 1,
            padding: "40px 24px",
            display: "flex",
            justifyContent: "center",
          }}
      >
      <div style={{ width: "100%", maxWidth: 1000 }}>
          {selectedPuzzleId ? (
            <PuzzleSolver 
              puzzleId={selectedPuzzleId} 
              onBack={() => setSelectedPuzzleId(null)} 
            />
          ) : currentPath === "/solve" ? (
            <Solve onSelectPuzzle={selectPuzzle} />
          ) : (
            <CreatePuzzle />
          )}
        </div>
      </main>
    </div>
    </div>
  );
}