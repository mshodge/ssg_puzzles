from app.db.base import Base
from app.db.session import engine
from app.db import models  # IMPORTANT: imports all models

Base.metadata.create_all(bind=engine)