def test_health_check(client):
    response = client.get("/health")
    assert response.status_code == 200
    body = response.json()
    assert body.get("status") == "ok"


def test_register_login_and_list_jobs(client):
    register = client.post(
        "/auth/register",
        json={
            "name": "Test Recruiter",
            "email": "test.recruiter@example.com",
            "password": "password123",
        },
    )
    assert register.status_code == 201

    login = client.post(
        "/auth/login",
        json={"email": "test.recruiter@example.com", "password": "password123"},
    )
    assert login.status_code == 200
    token = login.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    me = client.get("/auth/me", headers=headers)
    assert me.status_code == 200
    assert me.json()["email"] == "test.recruiter@example.com"

    create_job = client.post(
        "/jobs",
        headers=headers,
        json={
            "title": "QA Engineer",
            "description": "Manual and automated testing with pytest.",
            "location": "Remote",
            "min_experience": 1,
            "max_experience": 4,
            "status": "open",
        },
    )
    assert create_job.status_code == 201
    assert create_job.json()["title"] == "QA Engineer"

    jobs = client.get("/jobs", headers=headers)
    assert jobs.status_code == 200
    payload = jobs.json()
    assert payload["total"] >= 1
    assert any(item["title"] == "QA Engineer" for item in payload["items"])
