import os

# Load .env file only if it exists (for local development)
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass

# Get environment variables - Railway/Render will inject these directly
DATABASE_URL = os.environ.get("DATABASE_URL", "postgresql+psycopg://michaelhodge@localhost:5432/ssp")
FRONTEND_URL = os.environ.get("FRONTEND_URL", "http://localhost:5173")
