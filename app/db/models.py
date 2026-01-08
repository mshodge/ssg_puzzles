import uuid
from datetime import datetime

from sqlalchemy import (
    String,
    Text,
    Integer,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .base import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    email: Mapped[str] = mapped_column(String, unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    puzzles = relationship("Puzzle", back_populates="creator")

class Puzzle(Base):
    __tablename__ = "puzzles"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    title: Mapped[str] = mapped_column(String)
    description: Mapped[str | None] = mapped_column(Text)
    team_name: Mapped[str] = mapped_column(String, index=True)
    hint: Mapped[str | None] = mapped_column(Text)
    solution_answer: Mapped[str | None] = mapped_column(Text)

    format: Mapped[str] = mapped_column(String)
    mode: Mapped[str] = mapped_column(String)

    team_a_color: Mapped[str] = mapped_column(String)
    team_b_color: Mapped[str] = mapped_column(String)

    ball_carrier_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("players.id")
    )

    created_by: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.id"),
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    creator = relationship("User", back_populates="puzzles")

    players = relationship(
        "Player",
        back_populates="puzzle",
        foreign_keys="Player.puzzle_id"
    )

    positions = relationship(
        "Position",
        back_populates="puzzle"
    )

    ball_carrier = relationship(
        "Player",
        foreign_keys=[ball_carrier_id],
        post_update=True
    )

class Player(Base):
    __tablename__ = "players"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )

    puzzle_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("puzzles.id", ondelete="CASCADE")
    )

    team: Mapped[str] = mapped_column(String)
    label: Mapped[str] = mapped_column(String)

    puzzle = relationship(
        "Puzzle",
        back_populates="players",
        foreign_keys=[puzzle_id]
    )

    positions = relationship(
        "Position",
        back_populates="player"
    )



class Position(Base):
    __tablename__ = "positions"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4
    )
    puzzle_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("puzzles.id", ondelete="CASCADE")
    )
    player_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("players.id", ondelete="CASCADE")
    )

    square_id: Mapped[int] = mapped_column(Integer)
    position_type: Mapped[str] = mapped_column(String)

    puzzle = relationship(
        "Puzzle",
        back_populates="positions",
        foreign_keys=[puzzle_id]
    )
    player = relationship("Player", back_populates="positions")
