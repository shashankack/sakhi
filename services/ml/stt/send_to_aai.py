"""Send a transcript to Aai BFF POST /api/chat.

Usage:
  set Aai_CHAT_URL=http://<integration-ip>:3001/api/chat
  python send_to_Aai.py "periods late and facial hair"
"""

from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

CHAT_URL = os.environ.get("Aai_CHAT_URL", "http://127.0.0.1:3001/api/chat")


def ask_Aai(transcript: str, locale: str = "auto") -> dict:
    payload = json.dumps({"message": transcript, "locale": locale}).encode("utf-8")
    req = urllib.request.Request(
        CHAT_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as res:
        return json.loads(res.read().decode("utf-8"))


if __name__ == "__main__":
    text = " ".join(sys.argv[1:]).strip() or (
        "periods 2 mahine se nahi aaye, chehre pe baal aa rahe hain"
    )
    print(f"POST {CHAT_URL}", file=sys.stderr)
    try:
        out = ask_Aai(text)
    except urllib.error.URLError as exc:
        print(f"Failed to reach Aai API: {exc}", file=sys.stderr)
        raise SystemExit(1) from exc
    print(json.dumps(out, ensure_ascii=False, indent=2))
