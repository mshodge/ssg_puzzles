"""add team_name to puzzles

Revision ID: abc123456789
Revises: 514bb985e440
Create Date: 2026-01-06 14:16:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'abc123456789'
down_revision: Union[str, Sequence[str], None] = '92b8d9c1c768'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add team_name column to puzzles table."""
    op.add_column('puzzles', sa.Column('team_name', sa.String(), nullable=False, server_default=''))
    op.create_index(op.f('ix_puzzles_team_name'), 'puzzles', ['team_name'], unique=False)
    # Remove server_default after adding the column
    op.alter_column('puzzles', 'team_name', server_default=None)


def downgrade() -> None:
    """Remove team_name column from puzzles table."""
    op.drop_index(op.f('ix_puzzles_team_name'), table_name='puzzles')
    op.drop_column('puzzles', 'team_name')
