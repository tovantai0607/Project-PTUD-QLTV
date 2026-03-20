import os

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.pool import StaticPool

SQLALCHEMY_DATABASE_URL = os.getenv("LIBRARY_DATABASE_URL", "sqlite:///./library.db")

engine_kwargs = {}
if SQLALCHEMY_DATABASE_URL.startswith("sqlite"):
    engine_kwargs["connect_args"] = {"check_same_thread": False}
    if SQLALCHEMY_DATABASE_URL in {"sqlite://", "sqlite:///:memory:"}:
        engine_kwargs["poolclass"] = StaticPool

engine = create_engine(SQLALCHEMY_DATABASE_URL, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
