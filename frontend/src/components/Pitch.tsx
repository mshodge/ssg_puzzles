import { useRef, useState, useEffect } from "react";

type PlayerState = {
  id: string;
  label: string;
  square: number;
  color: string;
  hasBall: boolean;
  locked?: boolean;
};

type Props = {
  puzzle?: any;
  initialPlayers?: PlayerState[];
  onPlayerMove?: (players: PlayerState[]) => void;
  onPlayerDoubleClick?: (playerId: string) => void;
  canDrag?: (playerId: string) => boolean;
  style?: React.CSSProperties;
};

const GRID_COLS = 7; // 63 squares = 7 x 9
const GRID_ROWS = 9;

const positionToSquare = (
  normX: number,
  normY: number,
  cols: number,
  rows: number
) => {
  const col = Math.min(
    cols - 1,
    Math.max(0, Math.floor(normX * cols))
  );
  const row = Math.min(
    rows - 1,
    Math.max(0, Math.floor(normY * rows))
  );

  return row * cols + col + 1;
};

const squareToCenter = (squareId: number) => {
  const col = (squareId - 1) % GRID_COLS;
  const row = Math.floor((squareId - 1) / GRID_COLS);

  const squareWidth = 71 / GRID_COLS;
  const squareHeight = 100 / GRID_ROWS;

  return {
    x: col * squareWidth + squareWidth / 2,
    y: row * squareHeight + squareHeight / 2,
  };
};

export default function Pitch({ puzzle, initialPlayers: initialPlayersProp, onPlayerMove, onPlayerDoubleClick, canDrag, style }: Props) {
  const rows = puzzle?.grid?.rows || GRID_ROWS;
  const cols = puzzle?.grid?.cols || GRID_COLS;
  const svgRef = useRef<SVGSVGElement>(null);

  const initialPlayers: PlayerState[] = initialPlayersProp || Object.entries(puzzle.teams)
    .flatMap(([_, team]: any) =>
      team.players.map((p: any) => ({
        id: p.id,
        label: p.label,
        square: p.start_square,
        color: team.color,
        hasBall: p.has_ball,
      }))
    );

  const [players, setPlayers] = useState(initialPlayers);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  useEffect(() => {
    if (initialPlayersProp) {
      setPlayers(initialPlayersProp);
    }
  }, [initialPlayersProp]);

  function onPointerDown(id: string) {
    if (canDrag && !canDrag(id)) {
      return;
    }
    setDraggingId(id);
  }

  function onDoubleClick(id: string) {
    if (onPlayerDoubleClick) {
      onPlayerDoubleClick(id);
    }
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!draggingId || !svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    const square = positionToSquare(x, y, cols, rows);

    setPlayers((prev) => {
      // Check if another player is already in this square
      const isOccupied = prev.some(p => p.id !== draggingId && p.square === square);
      
      const updated = prev.map((p) =>
        p.id === draggingId ? { ...p, square: isOccupied ? p.square : square } : p
      );
      if (onPlayerMove) {
        onPlayerMove(updated);
      }
      return updated;
    });
  }

  function onPointerUp() {
    setDraggingId(null);
  }

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 71 100"
      style={{ width: "100%", touchAction: "none", ...style }}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {/* Pitch background */}
      <rect width="71" height="100" fill="#2e7d32" />

      {/* Pitch markings - rotated 90 degrees */}
      <rect
        x="3"
        y="4"
        width="64"
        height="91"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />

      <line
        x1="3"
        y1="50"
        x2="67"
        y2="50"
        stroke="white"
        strokeWidth="1"
      />
      <rect
        x="25"
        y="2"
        width="20"
        height="2"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
      <rect
        x="25"
        y="95"
        width="20"
        height="2"
        fill="none"
        stroke="white"
        strokeWidth="1"
      />
      <circle
        cx="35"
        cy="50"
        r="2"
        fill="white"
        stroke="white"
        strokeWidth="1"
      />
      <rect
        x="3"
        y="3"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="16"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="29"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="42"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="55"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="68"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      <rect
        x="3"
        y="81"
        width="64"
        height="6.5"
        fill="white"
        opacity="0.1"
      />
      {/* Players */}
      {players.map((player) => {
        const { x, y } = squareToCenter(player.square);


        return (
          <g
            key={player.id}
            transform={`translate(${x}, ${y})`}
            onPointerDown={() => onPointerDown(player.id)}
            onDoubleClick={() => onDoubleClick(player.id)}
            style={{ cursor: canDrag && !canDrag(player.id) ? "not-allowed" : "grab" }}
          >
            <circle
              r="3.5"
              fill={player.color}
              stroke="white"
              strokeWidth="0.8"
            />
            <text
              y="1"
              textAnchor="middle"
              fontSize="2.5"
              fill="white"
            >
              {player.label}
            </text>

            {player.hasBall && (
              <text
                x="3"
                y="3"
                textAnchor="middle"
                fontSize="4"
              >
                ⚽
              </text>
            )}

            {player.locked && (
              <g transform="translate(-3, 3)">
                <rect
                  x="-0.8"
                  y="-1.2"
                  width="1.6"
                  height="1.8"
                  fill="#FFD700"
                  stroke="#000"
                  strokeWidth="0.3"
                  rx="0.3"
                />
                <circle
                  cx="0"
                  cy="-1.5"
                  r="0.6"
                  fill="none"
                  stroke="#000"
                  strokeWidth="0.3"
                />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
