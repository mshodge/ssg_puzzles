"""add puzzle_id to players

Revision ID: xyz999888777
Revises: 514bb985e440
Create Date: 2026-01-07 15:52:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'xyz999888777'
down_revision: Union[str, Sequence[str], None] = '514bb985e440'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add puzzle_id column to players table."""
    op.add_column('players', sa.Column('puzzle_id', sa.Uuid(), nullable=False))
    op.create_foreign_key('fk_players_puzzle_id', 'players', 'puzzles', ['puzzle_id'], ['id'])


def downgrade() -> None:
    """Remove puzzle_id column from players table."""
    op.drop_constraint('fk_players_puzzle_id', 'players', type_='foreignkey')
    op.drop_column('players', 'puzzle_id')
