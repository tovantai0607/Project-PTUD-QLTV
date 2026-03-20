from fastapi.testclient import TestClient


def create_category(client: TestClient, name: str = "Công nghệ thông tin"):
    response = client.post(
        "/api/categories",
        json={"name": name, "description": "Danh mục test"},
    )
    assert response.status_code == 201
    return response.json()


def create_book(client: TestClient, category_id: int, title: str = "Clean Code", quantity: int = 2):
    response = client.post(
        "/api/books",
        json={
            "title": title,
            "publisher": "NXB Trẻ",
            "pages": 320,
            "size": "16x24cm",
            "author": "Robert C. Martin",
            "total_quantity": quantity,
            "category_id": category_id,
        },
    )
    assert response.status_code == 201
    return response.json()


def test_create_and_get_book_detail(client: TestClient):
    category = create_category(client)
    created = create_book(client, category["id"])

    assert created["title"] == "Clean Code"
    assert len(created["copies"]) == 2

    detail = client.get(f"/api/books/{created['id']}")
    assert detail.status_code == 200
    payload = detail.json()
    assert payload["id"] == created["id"]
    assert payload["category"]["name"] == category["name"]
    assert payload["copies"][0]["copy_code"].startswith(f"B{created['id']}-")


def test_duplicate_category_is_rejected(client: TestClient):
    create_category(client, name="Kinh tế")
    duplicate = client.post(
        "/api/categories",
        json={"name": "Kinh tế", "description": "Danh mục khác"},
    )
    assert duplicate.status_code == 400
    assert duplicate.json()["detail"] == "Chuyên ngành đã tồn tại"


def test_update_book_category(client: TestClient):
    category_a = create_category(client, name="CNTT")
    category_b = create_category(client, name="Ngoại ngữ")
    created = create_book(client, category_a["id"], title="Learning English", quantity=1)

    updated = client.put(
        f"/api/books/{created['id']}",
        json={"title": "Learning English Advanced", "category_id": category_b["id"]},
    )
    assert updated.status_code == 200
    payload = updated.json()
    assert payload["title"] == "Learning English Advanced"
    assert payload["category"]["id"] == category_b["id"]
