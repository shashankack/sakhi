from __future__ import annotations

import httpx

from .config import OLLAMA_ENABLED, OLLAMA_MODEL, OLLAMA_TIMEOUT_S, OLLAMA_URL

_LANG_NAME = {"en": "English", "hi": "Hindi", "kn": "Kannada"}


def polish_reply(reply: str, user_message: str, language: str) -> str | None:
    if not OLLAMA_ENABLED:
        return None
    lang_name = _LANG_NAME.get(language, "English")
    prompt = (
        "Rewrite the educational reply to be clearer and kinder. "
        "Do NOT diagnose. Do NOT say the user has PCOS. "
        f"Keep the same language ({lang_name}). "
        f"User said: {user_message[:500]}\n\nDraft:\n{reply}\n\nRewritten:"
    )
    try:
        with httpx.Client(timeout=OLLAMA_TIMEOUT_S) as client:
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
