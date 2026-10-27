"""Verify a real Google AI Studio Gemma API call using the local .env file.

This script never prints the API key. Run from the project root:
    python tools/test_gemma_api.py
"""
from __future__ import annotations
import os
import sys
from pathlib import Path

try:
    import requests
    from dotenv import load_dotenv
except ImportError as exc:
    print(f"Missing dependency: {exc}. Install with: python -m pip install requests python-dotenv")
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[1]
load_dotenv(ROOT / ".env")
api_key = (os.getenv("GEMINI_API_KEY") or "").strip()
model = (os.getenv("GEMINI_MODEL") or "gemma-4-26b-a4b-it").strip()
base_url = (os.getenv("GEMINI_BASE_URL") or "https://generativelanguage.googleapis.com").strip().rstrip("/")

if not api_key:
    print("FAIL: GEMINI_API_KEY is empty. Add it to the project-root .env file; do not paste it into source code.")
    raise SystemExit(2)
if not model:
    print("FAIL: GEMINI_MODEL is empty.")
    raise SystemExit(2)

url = f"{base_url}/v1beta/models/{model}:generateContent"
payload = {
    "contents": [{"parts": [{"text": "Reply with exactly: CIPHER GEMMA CONNECTION OK"}]}],
    "generationConfig": {"temperature": 0, "maxOutputTokens": 64},
}
print(f"Testing Google AI Studio model: {model}")
try:
    response = requests.post(url, headers={"x-goog-api-key": api_key, "Content-Type": "application/json"}, json=payload, timeout=30)
except requests.RequestException as exc:
    print(f"FAIL: Could not reach Google AI API ({type(exc).__name__}). Check network access and try again.")
    raise SystemExit(1)

if response.status_code >= 400:
    # Never print request headers or API key. Limit response text to a short diagnostic.
    try:
        detail = response.json().get("error", {}).get("message", "API returned an error")
    except Exception:
        detail = "API returned an error"
    print(f"FAIL: HTTP {response.status_code}: {str(detail)[:500]}")
    if response.status_code == 401 or response.status_code == 403:
        print("Check that the key is valid and the API is enabled for its Google project.")
    elif response.status_code == 404:
        print("The model ID may not be available to this API project. Check the official Gemma API model list.")
    elif response.status_code == 429:
        print("Rate limit or quota reached. Check AI Studio quota and billing/availability for this model.")
    raise SystemExit(1)

try:
    data = response.json()
    text = "".join(part.get("text", "") for part in data["candidates"][0]["content"]["parts"])
except (ValueError, KeyError, IndexError, TypeError):
    print("FAIL: API returned HTTP success but no readable generated text. Inspect the response structure without exposing secrets.")
    raise SystemExit(1)

if not text.strip():
    print("FAIL: API returned an empty response.")
    raise SystemExit(1)
print("PASS: A live model response was received.")
print("Model response:")
print(text[:1000])
print("This verifies API connectivity only; run the application workflow tests separately.")
