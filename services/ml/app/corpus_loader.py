from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import yaml

from .config import RESEARCH_CORPUS, SEED_CORPUS, VALID_THEME_IDS


@dataclass
class Chunk:
    chunk_id: str
    source: str
    section: str
    text: str
    theme_ids: list[str] = field(default_factory=list)


FRONTMATTER_RE = re.compile(r"^---\s*\n(.*?)\n---\s*\n(.*)$", re.S)


def _parse_md(path: Path) -> tuple[dict, str]:
    raw = path.read_text(encoding="utf-8")
    m = FRONTMATTER_RE.match(raw)
    if not m:
        return {}, raw
    meta = yaml.safe_load(m.group(1)) or {}
    return meta if isinstance(meta, dict) else {}, m.group(2)


def _split_sections(body: str) -> list[tuple[str, str]]:
    parts = re.split(r"\n(?=##\s+)", body.strip())
    sections: list[tuple[str, str]] = []
    for i, part in enumerate(parts):
        part = part.strip()
        if not part:
            continue
        if part.startswith("## "):
            title_line, _, rest = part.partition("\n")
            title = title_line.replace("## ", "", 1).strip() or f"Section {i}"
            sections.append((title, rest.strip() or part))
        elif part.startswith("# "):
            title_line, _, rest = part.partition("\n")
            title = title_line.replace("# ", "", 1).strip() or "Overview"
            sections.append((title, (rest or part).strip()))
        else:
            sections.append(("Overview", part))
    return sections or [("Overview", body.strip())]


def iter_corpus_dirs() -> list[Path]:
    dirs: list[Path] = []
    if RESEARCH_CORPUS.is_dir():
        dirs.append(RESEARCH_CORPUS)
    if SEED_CORPUS.is_dir():
        dirs.append(SEED_CORPUS)
    return dirs


def load_chunks() -> list[Chunk]:
    chunks: list[Chunk] = []
    seen_names: set[str] = set()

    for corpus_dir in iter_corpus_dirs():
        for path in sorted(corpus_dir.glob("*.md")):
            if path.name.lower() == "readme.md":
                continue
            # Prefer research/corpus file over seed with same name
            if path.name in seen_names and corpus_dir == SEED_CORPUS:
                continue
            seen_names.add(path.name)
            meta, body = _parse_md(path)
            theme_ids = [
                t
                for t in (meta.get("theme_ids") or [])
                if isinstance(t, str) and t in VALID_THEME_IDS
            ]
            for idx, (section, text) in enumerate(_split_sections(body)):
                if len(text) < 40:
                    continue
                chunks.append(
                    Chunk(
                        chunk_id=f"{path.stem}:{idx}",
                        source=path.name,
                        section=section,
                        text=text,
                        theme_ids=theme_ids,
                    )
                )
    return chunks
