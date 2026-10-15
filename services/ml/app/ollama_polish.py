from __future__ import annotations

import re

import httpx

from .config import OLLAMA_ENABLED, OLLAMA_MODEL, OLLAMA_TIMEOUT_S, OLLAMA_URL

_LANG_NAME = {"en": "English", "hi": "Hindi", "kn": "Kannada"}

_META_PREFIX = re.compile(
    r"^(?:here(?:'s| is)|sure[,!]?\s+(?:here(?:'s| is))?|rewritten(?:\s+version)?|"
    r"certainly|of course|okay[,!]?\s*|i(?:'ve| have)\s+rewritten|"
    r"below is|the rewritten|updated reply|"
    r"यह(?:\s+है)?(?:\s+पुनर्लिखित)?|यहाँ|"
    r"ಇಲ್ಲಿದೆ|ಪುನಃ\s*ಬರೆದ|"
    r"version of[^:]*:\s*)",
    re.I,
)
_DIAGNOSIS_MARKERS = re.compile(
    r"\b(you have pcos|diagnosed with pcos|you are suffering from pcos|"
    r"confirm(?:s|ed)?\s+pcos|आपको pcos है|ನಿಮಗೆ pcos ಇದೆ)\b",
    re.I,
)
_DEVANAGARI = re.compile(r"[\u0900-\u097F]")
_KANNADA = re.compile(r"[\u0C80-\u0CFF]")


def _strip_meta(text: str) -> str:
    cleaned = text.strip().strip('"').strip("'").strip()
    # Drop leading "Here's a rewritten version:" style lines
    lines = [ln.strip() for ln in cleaned.splitlines() if ln.strip()]
    if not lines:
        return ""
    first = _META_PREFIX.sub("", lines[0]).lstrip(" :-–—")
    if first:
        lines[0] = first
    elif len(lines) > 1:
        lines = lines[1:]
    cleaned = " ".join(lines)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned


def _script_ok(text: str, language: str) -> bool:
    has_hi = bool(_DEVANAGARI.search(text))
    has_kn = bool(_KANNADA.search(text))
    if language == "hi":
        return has_hi and not has_kn
    if language == "kn":
        return has_kn and not has_hi
    # English: allow Latin; reject if mostly Indic script
    if has_hi or has_kn:
        latin = len(re.findall(r"[A-Za-z]", text))
        return latin >= 40
    return True


def _accept(polished: str, draft: str, language: str) -> str | None:
    text = _strip_meta(polished)
    if len(text) < 40:
        return None
    if len(text) > max(520, len(draft) + 180):
        text = text[:500].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    if _DIAGNOSIS_MARKERS.search(text):
        return None
    if not _script_ok(text, language):
        return None
    return text


def polish_reply(reply: str, user_message: str, language: str) -> str | None:
    if not OLLAMA_ENABLED:
        return None
    lang_name = _LANG_NAME.get(language, "English")
    prompt = (
        f"You polish educational health replies for Sakhi. Language: {lang_name} only.\n"
        "Rules:\n"
        "- Output ONLY the final reply paragraph(s). No title, no preamble, no 'Here is…'.\n"
        "- Keep it warm, clear, and under 3 short sentences (~90 words max).\n"
        "- Educational only. Do NOT diagnose. Do NOT say the user has PCOS.\n"
        "- Do NOT invent medical facts beyond the draft.\n"
        "- Keep the same language/script as the draft.\n\n"
        f"User said: {user_message[:400]}\n\n"
        f"Draft:\n{reply}\n"
    )
    try:
        with httpx.Client(timeout=OLLAMA_TIMEOUT_S) as client:
            res = client.post(
                OLLAMA_URL,
                json={
                    "model": OLLAMA_MODEL,
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": 140,
                        "temperature": 0.4,
                    },
                },
            )
            if res.status_code != 200:
                return None
            data = res.json()
            raw = (data.get("response") or "").strip()
            return _accept(raw, reply, language)
    except Exception:
        return None
