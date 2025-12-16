import requests

def test_health():
    r = requests.get("http://localhost:5000/health")
    assert r.status_code == 200
    assert r.text == "OK"
