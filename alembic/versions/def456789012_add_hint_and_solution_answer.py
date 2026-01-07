"""add hint and solution_answer to puzzles

Revision ID: def456789012
Revises: abc123456789
Create Date: 2026-01-06 14:47:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'def456789012'
down_revision: Union[str, Sequence[str], None] = 'abc123456789'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add hint and solution_answer columns to puzzles table."""
    op.add_column('puzzles', sa.Column('hint', sa.Text(), nullable=True))
    op.add_column('puzzles', sa.Column('solution_answer', sa.Text(), nullable=True))


def downgrade() -> None:
    """Remove hint and solution_answer columns from puzzles table."""
    op.drop_column('puzzles', 'solution_answer')
    op.drop_column('puzzles', 'hint')
