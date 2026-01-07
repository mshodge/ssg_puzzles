import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models import Puzzle, Player, Position
from app.schemas.puzzle import PuzzleCreate, PuzzleOut, PuzzleValidationRequest, PuzzleValidationResponse, PuzzleDetailOut
from app.api import users

router = APIRouter()
router.include_router(users.router)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/puzzles", response_model=PuzzleOut)
def create_puzzle(
    data: PuzzleCreate,
    db: Session = Depends(get_db),
):
    puzzle = Puzzle(
        title=data.title,
        description=data.description,
        team_name=data.team_name,
        hint=data.hint,
        solution_answer=data.solution_answer,
        format=data.format,
        mode=data.mode,
        team_a_color=data.team_a_color,
        team_b_color=data.team_b_color,
        created_by=None,
    )

    db.add(puzzle)
    db.flush()

    # Auto-create players
    players = []
    for team in ["A", "B"]:
        for i in range(1, 5):
            player = Player(
                puzzle_id=puzzle.id,
                team=team,
                label=f"{team}{i}"
            )
            db.add(player)
            players.append(player)

    db.flush()

    player_lookup = {p.label: p for p in players}

    # Validate ball carrier
    if data.ball_carrier_label not in player_lookup:
        raise HTTPException(
            status_code=400,
            detail="Invalid ball carrier"
        )

    puzzle.ball_carrier_id = player_lookup[
        data.ball_carrier_label
    ].id

    # Save positions
    def save_positions(items, position_type):
        for pos in items:
            if pos.player_label not in player_lookup:
                raise HTTPException(
                    status_code=400,
                    detail=f"Invalid player {pos.player_label}"
                )
            db.add(Position(
                puzzle_id=puzzle.id,
                player_id=player_lookup[pos.player_label].id,
                square_id=pos.square_id,
                position_type=position_type
            ))

    save_positions(data.starting_positions, "start")
    save_positions(data.solution_positions, "solution")
    if hasattr(data, 'locked_positions') and data.locked_positions:
        save_positions(data.locked_positions, "locked")

    db.commit()
    db.refresh(puzzle)

    return puzzle

@router.get("/puzzles", response_model=list[PuzzleOut])
def list_puzzles(
    team_name: str | None = None,
    db: Session = Depends(get_db),
):
    query = db.query(Puzzle)
    
    if team_name:
        query = query.filter(Puzzle.team_name == team_name)
    
    puzzles = query.order_by(Puzzle.created_at.desc()).all()
    return puzzles

@router.get("/puzzles/{puzzle_id}", response_model=PuzzleDetailOut)
def get_puzzle(
    puzzle_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    puzzle = db.query(Puzzle).filter(
        Puzzle.id == puzzle_id
    ).first()

    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    # Fetch players
    players = db.query(Player).filter(
        Player.puzzle_id == puzzle.id
    ).all()

    # Fetch starting positions
    start_positions = db.query(Position).filter(
        Position.puzzle_id == puzzle.id,
        Position.position_type == "start"
    ).all()

    start_lookup = {
        pos.player_id: pos.square_id
        for pos in start_positions
    }

    # Fetch locked positions
    locked_positions = db.query(Position).filter(
        Position.puzzle_id == puzzle.id,
        Position.position_type == "locked"
    ).all()

    locked_player_ids = {pos.player_id for pos in locked_positions}

    teams = {
        "A": {
            "color": puzzle.team_a_color,
            "players": []
        },
        "B": {
            "color": puzzle.team_b_color,
            "players": []
        }
    }

    for player in players:
        teams[player.team]["players"].append({
            "id": player.id,
            "label": player.label,
            "start_square": start_lookup.get(player.id),
            "has_ball": player.id == puzzle.ball_carrier_id,
            "locked": player.id in locked_player_ids
        })

    return {
        "id": puzzle.id,
        "title": puzzle.title,
        "description": puzzle.description,
        "team_name": puzzle.team_name,
        "hint": puzzle.hint,
        "format": puzzle.format,
        "mode": puzzle.mode,
        "grid": {
            "rows": 9,
            "cols": 7,
            "total_squares": 63
        },
        "teams": teams
    }

@router.get("/puzzles/{puzzle_id}/solution")
def get_puzzle_solution(
    puzzle_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    puzzle = db.query(Puzzle).filter(
        Puzzle.id == puzzle_id
    ).first()

    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    # Fetch players
    players = db.query(Player).filter(
        Player.puzzle_id == puzzle.id
    ).all()

    player_lookup = {p.id: p.label for p in players}

    # Fetch solution positions
    solutions = db.query(Position).filter(
        Position.puzzle_id == puzzle.id,
        Position.position_type == "solution"
    ).all()

    return [
        {
            "player_label": player_lookup[pos.player_id],
            "square_id": pos.square_id
        }
        for pos in solutions
    ]

@router.post(
    "/puzzles/{puzzle_id}/validate",
    response_model=PuzzleValidationResponse
)
def validate_puzzle(
    puzzle_id: uuid.UUID,
    submission: PuzzleValidationRequest,
    db: Session = Depends(get_db),
):
    puzzle = db.query(Puzzle).filter(
        Puzzle.id == puzzle_id
    ).first()

    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    # Fetch players
    players = db.query(Player).filter(
        Player.puzzle_id == puzzle.id
    ).all()

    player_lookup = {p.label: p for p in players}

    # Fetch solution positions
    solutions = db.query(Position).filter(
        Position.puzzle_id == puzzle.id,
        Position.position_type == "solution"
    ).all()

    solution_lookup = {
        pos.player_id: pos.square_id
        for pos in solutions
    }

    # Validate submission players
    for pos in submission.positions:
        if pos.player_label not in player_lookup:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid player {pos.player_label}"
            )

    # Build submission lookup
    submitted_lookup = {
        player_lookup[pos.player_label].id: pos.square_id
        for pos in submission.positions
    }

    # Check all solution players are present
    for player_id in solution_lookup:
        if player_id not in submitted_lookup:
            return {"correct": False}

    # Compare positions
    for player_id, correct_square in solution_lookup.items():
        if submitted_lookup[player_id] != correct_square:
            return {"correct": False, "solution_answer": None}

    return {"correct": True, "solution_answer": puzzle.solution_answer}
