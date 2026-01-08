"""player options

Revision ID: b34e783d034b
Revises: mno345678901
Create Date: 2026-01-08 16:04:25.117359

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b34e783d034b'
down_revision: Union[str, Sequence[str], None] = 'mno345678901'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
