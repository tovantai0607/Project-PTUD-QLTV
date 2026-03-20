from fastapi.testclient import TestClient
from pathlib import Path
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from uuid import uuid4

from app.database import Base, get_db
from app.main import app


@pytest.fixture(scope="function")
def client():
    temp_dir = Path(__file__).resolve().parent.parent / ".testdata"
    temp_dir.mkdir(exist_ok=True)
    db_file = temp_dir / f"test-{uuid4().hex}.db"
    engine = create_engine(
        f"sqlite:///{db_file}",
        connect_args={"check_same_thread": False},
    )
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    Base.metadata.create_all(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as c:
        yield c

    app.dependency_overrides.clear()
    Base.metadata.drop_all(bind=engine)
    engine.dispose()
    if db_file.exists():
        db_file.unlink()
