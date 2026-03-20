from datetime import date, timedelta

from fastapi.testclient import TestClient


def create_reader(client: TestClient, full_name: str = "Nguyễn Văn A"):
    response = client.post(
        "/api/readers",
        json={
            "full_name": full_name,
            "class_name": "DHKTPM17",
            "date_of_birth": "2003-01-15",
            "gender": "Nam",
        },
    )
    assert response.status_code == 201
    return response.json()


def create_category(client: TestClient, name: str = "Khoa học dữ liệu"):
    response = client.post(
        "/api/categories",
        json={"name": name, "description": "Danh mục test"},
    )
    assert response.status_code == 201
    return response.json()


def create_book(client: TestClient, category_id: int, title: str = "Python nâng cao"):
    response = client.post(
        "/api/books",
        json={
            "title": title,
            "publisher": "NXB Giáo dục",
            "pages": 280,
            "size": "16x24cm",
            "author": "Nhóm PTUD",
            "total_quantity": 1,
            "category_id": category_id,
        },
    )
    assert response.status_code == 201
    return response.json()


def seed_borrowable_copy(client: TestClient):
    reader = create_reader(client)
    category = create_category(client)
    book = create_book(client, category["id"])
    copy = book["copies"][0]
    return reader, book, copy


def test_available_copies_and_borrow_flow(client: TestClient):
    reader, book, copy = seed_borrowable_copy(client)

    available = client.get("/api/borrow-system/available-copies")
    assert available.status_code == 200
    assert available.json()[0]["id"] == copy["id"]

    borrow = client.post(
        "/api/borrow-system/borrow",
        params={"reader_id": reader["id"], "book_copy_id": copy["id"]},
    )
    assert borrow.status_code == 200

    borrowed = client.get("/api/borrow-system/borrowed")
    assert borrowed.status_code == 200
    payload = borrowed.json()
    assert len(payload) == 1
    assert payload[0]["reader_name"] == reader["full_name"]
    assert payload[0]["book_title"] == book["title"]
    assert payload[0]["copy_code"] == copy["copy_code"]
    assert payload[0]["due_date"] == (date.today() + timedelta(days=7)).isoformat()

    available_after_borrow = client.get("/api/borrow-system/available-copies")
    assert available_after_borrow.status_code == 200
    assert available_after_borrow.json() == []


def test_return_book_restores_available_copy(client: TestClient):
    reader, _, copy = seed_borrowable_copy(client)

    borrow = client.post(
        "/api/borrow-system/borrow",
        params={"reader_id": reader["id"], "book_copy_id": copy["id"]},
    )
    record_id = borrow.json()["record_id"]

    returned = client.post(f"/api/borrow-system/return/{record_id}")
    assert returned.status_code == 200

    borrowed = client.get("/api/borrow-system/borrowed")
    assert borrowed.status_code == 200
    assert borrowed.json() == []

    available = client.get("/api/borrow-system/available-copies")
    assert available.status_code == 200
    assert available.json()[0]["id"] == copy["id"]


def test_admin_user_list_and_reports(client: TestClient):
    created_user = client.post(
        "/api/admin/users",
        json={
            "username": "thuthu01",
            "password": "123456",
            "full_name": "Thủ thư 01",
            "role": "admin",
        },
    )
    assert created_user.status_code == 201

    users = client.get("/api/admin/users")
    assert users.status_code == 200
    assert users.json()[0]["username"] == "thuthu01"

    reader, book, copy = seed_borrowable_copy(client)
    client.post(
        "/api/borrow-system/borrow",
        params={"reader_id": reader["id"], "book_copy_id": copy["id"]},
    )

    top_books = client.get("/api/admin/reports/top-books")
    assert top_books.status_code == 200
    assert top_books.json()[0]["book_name"] == book["title"]
    assert top_books.json()[0]["borrow_count"] == 1

    unreturned = client.get("/api/admin/reports/unreturned")
    assert unreturned.status_code == 200
    report = unreturned.json()[0]
    assert report["reader_name"] == reader["full_name"]
    assert report["book_name"] == book["title"]
    assert report["copy_code"] == copy["copy_code"]
    assert report["days_overdue"] >= 0
