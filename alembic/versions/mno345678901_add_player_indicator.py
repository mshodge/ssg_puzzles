"""add_player_indicator

Revision ID: mno345678901
Revises: d6e149bdc100
Create Date: 2026-01-08 15:55:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'mno345678901'
down_revision: Union[str, Sequence[str], None] = 'd6e149bdc100'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Add indicator column to players table."""
    op.add_column('players', sa.Column('indicator', sa.String(), nullable=True))


def downgrade() -> None:
    """Remove indicator column from players table."""
    op.drop_column('players', 'indicator')
