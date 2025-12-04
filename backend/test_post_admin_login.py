"""
Simple test script to POST to the admin login endpoint and print response details.

Usage:
    python backend/test_post_admin_login.py [url] [email] [password]

Defaults:
    url: http://127.0.0.1:8000/admin/login/
    email: test@example.com
    password: password123

This script requires the `requests` package.
"""
import sys
import requests
import json

DEFAULT_URL = "http://127.0.0.1:8000/admin/login/"

def main():
    url = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_URL
    email = sys.argv[2] if len(sys.argv) > 2 else "test@example.com"
    password = sys.argv[3] if len(sys.argv) > 3 else "password123"

    payload = {"email": email, "password": password}

    session = requests.Session()

    print(f"POST {url} with payload: {payload}\n")

    try:
        r = session.post(url, json=payload, timeout=10)
    except Exception as e:
        print("Request failed:", e)
        return

    print("Status code:", r.status_code)
    print("Response headers:")
    for k, v in r.headers.items():
        print(f"  {k}: {v}")

    print("\nResponse text:")
    print(r.text)

    try:
        parsed = r.json()
        print("\nResponse JSON parsed:")
        print(json.dumps(parsed, indent=2))
    except Exception:
        pass

    print("\nSession cookies after request:")
    for c in session.cookies:
        print(f"  {c.name} = {c.value}; domain={c.domain}; path={c.path}")

if __name__ == '__main__':
    main()
