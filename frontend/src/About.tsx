export default function About() {
  return (
    <div style={{ padding: "40px 24px", maxWidth: 800, margin: "0 auto" }}>
      <div style={{ 
        backgroundColor: "white", 
        borderRadius: 12, 
        padding: 40,
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
      }}>
        <h1 style={{ 
          margin: "0 0 24px 0", 
          fontSize: 36, 
          fontWeight: 700, 
          color: "#1e293b",
          textAlign: "center"
        }}>
          About Football Tactics Puzzles
        </h1>

        <div style={{ fontSize: 16, lineHeight: 1.8, color: "#475569" }}>
          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
              What is this?
            </h2>
            <p style={{ marginBottom: 12 }}>
              Football Tactics Puzzles is a fun, interactive platform designed for kids and coaches to create and solve tactical football challenges. Think of it as chess puzzles, but for football!
            </p>
            <p>
              Each puzzle presents a specific game situation where players need to figure out the best tactical solution to score or defend.
            </p>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
              How to Create a Puzzle
            </h2>
            <ol style={{ paddingLeft: 24, marginBottom: 12 }}>
              <li style={{ marginBottom: 12 }}>
                <strong>Enter puzzle details:</strong> Give your puzzle a title, description, and team name. Add optional hints and solution explanations.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Set starting positions:</strong> Drag players (numbered 1-4) to their starting positions on the pitch. Double-click players to lock them in place if they shouldn't move during the puzzle.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Set solution positions:</strong> Move the players to where they should end up for the correct solution. Locked players cannot be moved.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Save and share:</strong> Click "Save Puzzle" and you'll get a unique shareable link to send to your team!
              </li>
            </ol>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
              How to Solve a Puzzle
            </h2>
            <ol style={{ paddingLeft: 24, marginBottom: 12 }}>
              <li style={{ marginBottom: 12 }}>
                <strong>Browse puzzles:</strong> Go to "Solve Puzzles" and select a team to see their puzzle collection.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Study the situation:</strong> Look at the starting positions and read the puzzle description and any hints.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Move the players:</strong> Drag the unlocked players to where you think they should go to solve the tactical challenge.
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Submit your solution:</strong> Click "Submit Solution" to check if you got it right. The solution must match exactly!
              </li>
              <li style={{ marginBottom: 12 }}>
                <strong>Learn from the answer:</strong> If correct, you'll see the solution explanation. If wrong, try again or view the solution to learn.
              </li>
            </ol>
          </section>

          <section style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
              Key Features
            </h2>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 8 }}>
                <strong>Player Numbers:</strong> Players are numbered 1-4 for easy reference
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Locked Players:</strong> Some players can be locked to stay in position, focusing the puzzle on specific movements
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Ball Carrier:</strong> Red Player 1 always starts with the ball
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Shareable Links:</strong> Every puzzle has a unique URL you can share with your team
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Team Collections:</strong> Organize puzzles by team name so players can find their team's challenges
              </li>
              <li style={{ marginBottom: 8 }}>
                <strong>Hints & Explanations:</strong> Add helpful hints and detailed solution explanations to help players learn
              </li>
            </ul>
          </section>

          <section>
            <h2 style={{ fontSize: 24, fontWeight: 600, color: "#1e293b", marginBottom: 16 }}>
              Perfect For
            </h2>
            <ul style={{ paddingLeft: 24 }}>
              <li style={{ marginBottom: 8 }}>Youth football coaches creating training exercises</li>
              <li style={{ marginBottom: 8 }}>Kids learning tactical awareness and decision-making</li>
              <li style={{ marginBottom: 8 }}>Teams practicing specific game situations</li>
              <li style={{ marginBottom: 8 }}>Anyone who loves football and wants to improve their tactical understanding</li>
            </ul>
          </section>
        </div>

        <div style={{ 
          marginTop: 40, 
          padding: 20, 
          backgroundColor: "#f0f9ff", 
          borderRadius: 8,
          textAlign: "center"
        }}>
          <p style={{ margin: 0, fontSize: 16, color: "#0c4a6e" }}>
            Ready to get started? Create your first puzzle or browse existing ones!
          </p>
        </div>
      </div>
    </div>
  );
}
