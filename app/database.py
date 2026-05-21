from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker
from sqlalchemy.engine import URL

DATABASE_URL = URL.create(
    drivername="postgresql",
    username="postgres",
    password="arpg1234",
    host="localhost",
    database="arpg_analyzer",
)

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(bind=engine)

class Base(DeclarativeBase):
    pass

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()