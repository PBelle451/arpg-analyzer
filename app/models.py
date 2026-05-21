from sqlalchemy import Column, Integer, String, Float, Boolean
from app.database import Base
from sqlalchemy import DateTime
from datetime import datetime


class Build(Base):
    __tablename__ = "builds"

    id         = Column(Integer, primary_key=True, autoincrement=True)
    nome       = Column(String(128))
    classe     = Column(String(64))
    ascendancy = Column(String(64))
    main_skill = Column(String(128))
    popularidade = Column(Float, default=0.0)
    hc_viable  = Column(Boolean, default=False)

class MetaSnapshot(Base):
    __tablename__ = "meta_snapshots"

    id               = Column(Integer, primary_key=True, autoincrement=True)
    data             = Column(DateTime, default=datetime.utcnow)
    classe           = Column(String(64))
    popularidade_pct = Column(Float)
    rodada           = Column(Integer, default=0)