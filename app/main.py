from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
from app.core.config import settings

app = FastAPI(title="Soccer Puzzle Coach")

# Configure CORS for production
# Allow all origins for MVP - tighten in production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for MVP
    allow_credentials=False,  # Must be False when using wildcard origins
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    import os
    db_url = os.environ.get("DATABASE_URL", "NOT_SET")
    # Mask password for security
    if db_url != "NOT_SET" and "@" in db_url:
        parts = db_url.split("@")
        masked = parts[0].split(":")[0] + ":****@" + parts[1]
    else:
        masked = db_url
    return {
        "status": "ok",
        "database_url_set": db_url != "NOT_SET",
        "database_url_preview": masked[:50] + "..." if len(masked) > 50 else masked
    }

app.include_router(router)
