import pytest
from fastapi.testclient import TestClient
from main import app

class FakeRecord(dict):
    pass

class FakeConnection:
    async def fetch(self, sql, limit):
        return [
            FakeRecord({
                "tconst": "tt123",
                "primaryTitle": "Test Movie",
                "startYear": 2025,
                "genres": "Drama",
                "runtimeMinutes": 120,
                "averageRating": 8.5,
                "numVotes": 1500,
                "directors": "John Doe",
                "writers": "Jane Doe"
            })
        ][:limit]

class FakePool:
    def acquire(self):
        return self

    async def __aenter__(self):
        return FakeConnection()

    async def __aexit__(self, exc_type, exc, tb):
        pass

@pytest.fixture
def client(monkeypatch):
    async def fake_get_pool():
        return FakePool()

    monkeypatch.setattr(
        "main.get_pool",  # MUST match import location
        fake_get_pool
    )

    return TestClient(app)

def test_recent_movies(client):
    response = client.get("/api/main?limit=1")

    assert response.status_code == 200

    data = response.json()
    assert isinstance(data, list)
    assert len(data) == 1

    movie = data[0]
    assert movie["tconst"] == "tt123"
    assert movie["primary_title"] == "Test Movie"
    assert movie["start_year"] == 2025
    assert movie["average_rating"] == 8.5

def test_recent_limit_too_high(client):
    response = client.get("/api/main?limit=101")
    assert response.status_code == 422

def test_recent_limit_too_low(client):
    response = client.get("/api/main?limit=0")
    assert response.status_code == 422