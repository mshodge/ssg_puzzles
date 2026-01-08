import { useState, useEffect } from "react";
import CreatePuzzle from "./CreatePuzzle";
import Solve from "./Solve";
import PuzzleSolver from "./PuzzleSolver";
import About from "./About";

export default function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [selectedPuzzleId, setSelectedPuzzleId] = useState<string | null>(null);

  useEffect(() => {
    // Check if URL is a direct puzzle link on mount
    const path = window.location.pathname;
    const puzzleMatch = path.match(/^\/puzzle\/([a-f0-9-]+)$/);
    if (puzzleMatch) {
      setSelectedPuzzleId(puzzleMatch[1]);
      setCurrentPath("/solve");
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      const puzzleMatch = path.match(/^\/puzzle\/([a-f0-9-]+)$/);
      if (puzzleMatch) {
        setSelectedPuzzleId(puzzleMatch[1]);
        setCurrentPath("/solve");
      } else {
        setCurrentPath(path);
        setSelectedPuzzleId(null);
      }
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
    window.history.pushState({}, "", `/puzzle/${puzzleId}`);
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
        background: "linear-gradient(135deg, #ba0000 0%, #000000 100%)",
        padding: "16px 32px", 
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: 20, 
            fontWeight: 700, 
            color: "white",
            letterSpacing: "-0.5px"
          }}>
            
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
              color: currentPath === "/create" ? "#ba0000" : "white",
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
              color: currentPath === "/solve" ? "#ba0000" : "white",
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
          <button
            onClick={() => navigate("/about")}
            style={{
              padding: "10px 20px",
              fontSize: 15,
              fontWeight: 600,
              backgroundColor: currentPath === "/about" ? "white" : "rgba(255,255,255,0.2)",
              color: currentPath === "/about" ? "#ba0000" : "white",
              border: "none",
              borderRadius: 8,
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: currentPath === "/about" ? "0 2px 8px rgba(0,0,0,0.1)" : "none"
            }}
            onMouseEnter={(e) => {
              if (currentPath !== "/about") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (currentPath !== "/about") {
                e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.2)";
              }
            }}
          >
            About
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
              onBack={() => {
                setSelectedPuzzleId(null);
                window.history.pushState({}, "", "/solve");
              }} 
            />
          ) : currentPath === "/solve" ? (
            <Solve onSelectPuzzle={selectPuzzle} />
          ) : currentPath === "/about" ? (
            <About />
          ) : (
            <CreatePuzzle />
          )}
        </div>
      </main>
    </div>
    </div>
  );
}