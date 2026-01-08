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
    """Add CASCADE delete to foreign keys."""
    # Drop and recreate foreign keys with CASCADE
    
    # Players table - puzzle_id foreign key
    op.drop_constraint('players_puzzle_id_fkey', 'players', type_='foreignkey')
    op.create_foreign_key(
        'players_puzzle_id_fkey',
        'players', 'puzzles',
        ['puzzle_id'], ['id'],
        ondelete='CASCADE'
    )
    
    # Positions table - puzzle_id foreign key
    op.drop_constraint('positions_puzzle_id_fkey', 'positions', type_='foreignkey')
    op.create_foreign_key(
        'positions_puzzle_id_fkey',
        'positions', 'puzzles',
        ['puzzle_id'], ['id'],
        ondelete='CASCADE'
    )
    
    # Positions table - player_id foreign key
    op.drop_constraint('positions_player_id_fkey', 'positions', type_='foreignkey')
    op.create_foreign_key(
        'positions_player_id_fkey',
        'positions', 'players',
        ['player_id'], ['id'],
        ondelete='CASCADE'
    )


def downgrade() -> None:
    """Remove CASCADE delete from foreign keys."""
    # Drop and recreate foreign keys without CASCADE
    
    # Positions table - player_id foreign key
    op.drop_constraint('positions_player_id_fkey', 'positions', type_='foreignkey')
    op.create_foreign_key(
        'positions_player_id_fkey',
        'positions', 'players',
        ['player_id'], ['id']
    )
    
    # Positions table - puzzle_id foreign key
    op.drop_constraint('positions_puzzle_id_fkey', 'positions', type_='foreignkey')
    op.create_foreign_key(
        'positions_puzzle_id_fkey',
        'positions', 'puzzles',
        ['puzzle_id'], ['id']
    )
    
    # Players table - puzzle_id foreign key
    op.drop_constraint('players_puzzle_id_fkey', 'players', type_='foreignkey')
    op.create_foreign_key(
        'players_puzzle_id_fkey',
        'players', 'puzzles',
        ['puzzle_id'], ['id']
    )
