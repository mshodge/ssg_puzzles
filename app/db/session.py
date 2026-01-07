from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
import os

# Load DATABASE_URL directly from environment to avoid module caching issues
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg://michaelhodge@localhost:5432/ssp")

engine = create_engine(DATABASE_URL, echo=True)
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

def get_db() -> Session:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()