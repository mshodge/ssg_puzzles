from pydantic import BaseModel, Field
from typing import Dict, List, Literal
import uuid

class PositionInput(BaseModel):
    player_label: str
    square_id: int = Field(ge=0, le=62)
    indicator: str | None = None

class PuzzleCreate(BaseModel):
    title: str
    description: str | None = None
    team_name: str
    hint: str | None = None
    solution_answer: str | None = None

    format: Literal["4v4"]
    mode: Literal["attacking", "defending"]

    team_a_color: str
    team_b_color: str

    ball_carrier_label: str

    starting_positions: List[PositionInput]
    solution_positions: List[PositionInput]
    locked_positions: List[PositionInput] = []

class PuzzleOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    team_name: str
    hint: str | None
    format: str
    mode: str

    class Config:
        from_attributes = True

class PlayerOut(BaseModel):
    id: uuid.UUID
    label: str
    start_square: int
    has_ball: bool
    locked: bool = False
    indicator: str | None = None

class TeamOut(BaseModel):
    color: str
    players: List[PlayerOut]

class GridOut(BaseModel):
    rows: int
    cols: int
    total_squares: int

class PuzzleDetailOut(BaseModel):
    id: uuid.UUID
    title: str
    description: str | None
    team_name: str
    hint: str | None
    format: str
    mode: str

    grid: GridOut
    teams: Dict[str, TeamOut]

class PositionSubmission(BaseModel):
    player_label: str
    square_id: int

class PuzzleValidationRequest(BaseModel):
    positions: List[PositionSubmission]

class PlayerFeedback(BaseModel):
    player_label: str
    distance: int
    is_correct: bool

class PuzzleValidationResponse(BaseModel):
    correct: bool
    solution_answer: str | None = None
    feedback: str | None = None
    player_feedback: List[PlayerFeedback] = []