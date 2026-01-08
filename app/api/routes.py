import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.models import Puzzle, Player, Position
from app.db.session import get_db
from app.schemas.puzzle import (
    PuzzleCreate,
    PuzzleOut,
    PuzzleDetailOut,
    PuzzleValidationRequest,
    PuzzleValidationResponse,
    PlayerFeedback,
)
from app.core.grid import GRID_4V4
from app.api import users

router = APIRouter()
router.include_router(users.router)


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
            # Update player indicator if provided in starting positions
            if position_type == "start" and hasattr(pos, 'indicator') and pos.indicator:
                player_lookup[pos.player_label].indicator = pos.indicator
            
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
            "locked": player.id in locked_player_ids,
            "indicator": player.indicator
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
            return {"correct": False, "feedback": "Not all players have been positioned."}

    # Calculate distances for each player
    player_feedback_list = []
    all_correct = True
    
    for player_id, correct_square in solution_lookup.items():
        submitted_square = submitted_lookup[player_id]
        distance = GRID_4V4.manhattan_distance(submitted_square, correct_square)
        is_correct = distance == 0
        
        if not is_correct:
            all_correct = False
        
        # Find player label for feedback
        player = next(p for p in players if p.id == player_id)
        
        player_feedback_list.append(PlayerFeedback(
            player_label=player.label,
            distance=distance,
            is_correct=is_correct
        ))
    
    # Generate feedback message
    if all_correct:
        return {
            "correct": True,
            "solution_answer": puzzle.solution_answer,
            "feedback": "Perfect! All players are in the correct positions.",
            "player_feedback": player_feedback_list
        }
    
    # Build detailed feedback message
    incorrect_players = [pf for pf in player_feedback_list if not pf.is_correct]
    correct_players = [pf for pf in player_feedback_list if pf.is_correct]
    
    feedback_parts = []
    
    if len(incorrect_players) == 1:
        pf = incorrect_players[0]
        team_color = "Red" if pf.player_label.startswith("A") else "Blue"
        player_num = pf.player_label.replace("A", "").replace("B", "")
        square_word = "square" if pf.distance == 1 else "squares"
        feedback_parts.append(f"{team_color} Player {player_num} is {pf.distance} {square_word} from the ideal solution")
    else:
        for pf in incorrect_players:
            team_color = "Red" if pf.player_label.startswith("A") else "Blue"
            player_num = pf.player_label.replace("A", "").replace("B", "")
            square_word = "square" if pf.distance == 1 else "squares"
            feedback_parts.append(f"{team_color} Player {player_num} is {pf.distance} {square_word}")
    
    if correct_players and incorrect_players:
        correct_labels = []
        for pf in correct_players:
            team_color = "Red" if pf.player_label.startswith("A") else "Blue"
            player_num = pf.player_label.replace("A", "").replace("B", "")
            correct_labels.append(f"{team_color} Player {player_num}")
        
        if len(correct_labels) == 1:
            correct_text = f"{correct_labels[0]} is correct"
        else:
            correct_text = f"{', '.join(correct_labels[:-1])} and {correct_labels[-1]} are correct"
        
        feedback = f"{correct_text}, but {', and '.join(feedback_parts)} from the ideal solution."
    else:
        feedback = f"{', and '.join(feedback_parts)} from the ideal solution."
    
    return {
        "correct": False,
        "solution_answer": None,
        "feedback": feedback,
        "player_feedback": player_feedback_list
    }

@router.delete("/puzzles/{puzzle_id}")
def delete_puzzle(
    puzzle_id: uuid.UUID,
    db: Session = Depends(get_db),
):
    puzzle = db.query(Puzzle).filter(
        Puzzle.id == puzzle_id
    ).first()

    if not puzzle:
        raise HTTPException(status_code=404, detail="Puzzle not found")

    db.delete(puzzle)
    db.commit()

    return {"message": "Puzzle deleted successfully"}
