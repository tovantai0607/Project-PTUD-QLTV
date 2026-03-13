import pytest
from fastapi.testclient import TestClient

from app.database import Base, get_db
from app.main import app


@pytest.fixture(scope="function")
def client():
    # Use default DB (library.db). For isolated tests, use TESTING=1 and in-memory in database.py.
    with TestClient(app) as c:
        yield c
