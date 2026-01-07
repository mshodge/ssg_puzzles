from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import uuid

from app.db.session import get_db
from app.db.models import User

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/register")
def register_user(name: str, db: Session = Depends(get_db)):
    user = User(
        id=uuid.uuid4(),
        email=f"{name}@local.dev",  # placeholder
        password_hash="local"
    )
    db.add(user)
    db.commit()
    return {"user_id": user.id}
