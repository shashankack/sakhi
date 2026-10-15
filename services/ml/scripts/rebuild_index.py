"""Rebuild embedding index from research/corpus + seed_corpus."""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT))

from app.indexer import build_index  # noqa: E402


if __name__ == "__main__":
    info = build_index()
    print(f"Indexed {info['chunks']} chunks → {info['path']}")
