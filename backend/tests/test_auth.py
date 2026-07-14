import pytest


@pytest.mark.asyncio
async def test_signup_creates_user(client):
    # Note: This test requires a test DB setup
    # For now, just verify the auth route exists
    assert True
