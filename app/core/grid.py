from dataclasses import dataclass

@dataclass(frozen=True)
class GridConfig:
    cols: int = 7
    rows: int = 5

    @property
    def total(self) -> int:
        return self.cols * self.rows

GRID_4V4 = GridConfig()
