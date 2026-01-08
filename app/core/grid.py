from dataclasses import dataclass

@dataclass(frozen=True)
class GridConfig:
    cols: int = 7
    rows: int = 9

    @property
    def total(self) -> int:
        return self.cols * self.rows
    
    def square_to_coords(self, square_id: int) -> tuple[int, int]:
        """Convert square_id (1-63) to (x, y) coordinates."""
        # Square IDs are 1-indexed in the frontend, so subtract 1
        adjusted_id = square_id - 1
        x = adjusted_id % self.cols
        y = adjusted_id // self.cols
        return (x, y)
    
    def manhattan_distance(self, square1: int, square2: int) -> int:
        """Calculate Manhattan distance between two squares."""
        x1, y1 = self.square_to_coords(square1)
        x2, y2 = self.square_to_coords(square2)
        return abs(x1 - x2) + abs(y1 - y2)

GRID_4V4 = GridConfig()
