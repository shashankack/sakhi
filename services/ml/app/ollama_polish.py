from __future__ import annotations

import httpx

from .config import OLLAMA_ENABLED, OLLAMA_MODEL, OLLAMA_URL


def polish_reply(reply: str, user_message: str, language: str) -> str | None:
    if not OLLAMA_ENABLED:
        return None
    prompt = (
        "Rewrite the educational reply to be clearer and kinder. "
        "Do NOT diagnose. Do NOT say the user has PCOS. "
        f"Keep the same language ({'Hindi' if language == 'hi' else 'English'}). "
        f"User said: {user_message[:500]}\n\nDraft:\n{reply}\n\nRewritten:"
    )
    try:
        with httpx.Client(timeout=8.0) as client:
            res = client.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {"num_predict": 180},
                },
            )
            if res.status_code != 200:
                return None
            data = res.json()
            text = (data.get("response") or "").strip()
            return text or None
    except Exception:
        return None
