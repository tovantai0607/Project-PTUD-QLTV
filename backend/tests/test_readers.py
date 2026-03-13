import pytest
from fastapi.testclient import TestClient


def test_create_reader(client: TestClient):
    r = client.post(
        "/api/readers",
        json={
            "full_name": "Nguyễn Văn A",
            "class_name": "CNTT01",
            "date_of_birth": "2000-01-15",
            "gender": "Nam",
        },
    )
    assert r.status_code == 201
    data = r.json()
    assert data["full_name"] == "Nguyễn Văn A"
    assert data["class_name"] == "CNTT01"
    assert data["date_of_birth"] == "2000-01-15"
    assert data["gender"] == "Nam"
    assert "id" in data


def test_list_readers(client: TestClient):
    client.post(
        "/api/readers",
        json={
            "full_name": "Trần Thị B",
            "class_name": "KT02",
            "date_of_birth": "1999-05-20",
            "gender": "Nữ",
        },
    )
    r = client.get("/api/readers")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) >= 1
    names = [x["full_name"] for x in data]
    assert "Trần Thị B" in names


def test_get_reader(client: TestClient):
    create = client.post(
        "/api/readers",
        json={
            "full_name": "Lê Văn C",
            "class_name": "CNTT03",
            "date_of_birth": "2001-03-10",
            "gender": "Nam",
        },
    )
    assert create.status_code == 201
    rid = create.json()["id"]
    r = client.get(f"/api/readers/{rid}")
    assert r.status_code == 200
    assert r.json()["full_name"] == "Lê Văn C"


def test_update_reader(client: TestClient):
    create = client.post(
        "/api/readers",
        json={
            "full_name": "Phạm Thị D",
            "class_name": "KT01",
            "date_of_birth": "2000-08-01",
            "gender": "Nữ",
        },
    )
    assert create.status_code == 201
    rid = create.json()["id"]
    r = client.put(
        f"/api/readers/{rid}",
        json={
            "full_name": "Phạm Thị D (đã đổi tên)",
            "class_name": "KT01",
            "date_of_birth": "2000-08-01",
            "gender": "Nữ",
        },
    )
    assert r.status_code == 200
    assert r.json()["full_name"] == "Phạm Thị D (đã đổi tên)"


def test_delete_reader(client: TestClient):
    create = client.post(
        "/api/readers",
        json={
            "full_name": "Hoàng Văn E",
            "class_name": "CNTT04",
            "date_of_birth": "2002-11-22",
            "gender": "Nam",
        },
    )
    assert create.status_code == 201
    rid = create.json()["id"]
    r = client.delete(f"/api/readers/{rid}")
    assert r.status_code == 204
    get_r = client.get(f"/api/readers/{rid}")
    assert get_r.status_code == 404


def test_create_reader_missing_full_name(client: TestClient):
    r = client.post(
        "/api/readers",
        json={
            "class_name": "CNTT01",
            "date_of_birth": "2000-01-15",
            "gender": "Nam",
        },
    )
    assert r.status_code == 422


def test_create_reader_missing_class_name(client: TestClient):
    r = client.post(
        "/api/readers",
        json={
            "full_name": "Nguyễn Văn A",
            "date_of_birth": "2000-01-15",
            "gender": "Nam",
        },
    )
    assert r.status_code == 422


def test_create_reader_missing_date_of_birth(client: TestClient):
    r = client.post(
        "/api/readers",
        json={
            "full_name": "Nguyễn Văn A",
            "class_name": "CNTT01",
            "gender": "Nam",
        },
    )
    assert r.status_code == 422


def test_create_reader_missing_gender(client: TestClient):
    r = client.post(
        "/api/readers",
        json={
            "full_name": "Nguyễn Văn A",
            "class_name": "CNTT01",
            "date_of_birth": "2000-01-15",
        },
    )
    assert r.status_code == 422


def test_get_reader_not_found(client: TestClient):
    r = client.get("/api/readers/99999")
    assert r.status_code == 404
