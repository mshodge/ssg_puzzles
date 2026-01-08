"""add_cascade_delete_to_foreign_keys

Revision ID: d6e149bdc100
Revises: ghi789012345
Create Date: 2026-01-08 10:51:08.547057

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd6e149bdc100'
down_revision: Union[str, Sequence[str], None] = 'ghi789012345'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass
