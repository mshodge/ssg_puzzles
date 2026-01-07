import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+psycopg://michaelhodge@localhost:5432/ssp")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")
