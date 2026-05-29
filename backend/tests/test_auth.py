from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_login_invalid_user():

    response = client.post(
        "/auth/login",
        json={
            "username": "wronguser",
            "password": "wrongpass"
        }
    )

    assert response.status_code == 401