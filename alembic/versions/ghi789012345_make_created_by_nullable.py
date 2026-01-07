"""make created_by nullable

Revision ID: ghi789012345
Revises: def456789012
Create Date: 2026-01-06 16:30:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ghi789012345'
down_revision: Union[str, Sequence[str], None] = 'def456789012'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Make created_by column nullable."""
    op.alter_column('puzzles', 'created_by',
               existing_type=sa.UUID(),
               nullable=True)


def downgrade() -> None:
    """Make created_by column not nullable."""
    op.alter_column('puzzles', 'created_by',
               existing_type=sa.UUID(),
               nullable=False)
