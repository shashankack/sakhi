from __future__ import annotations

import json
import math
import re
from collections import Counter
from typing import Any

import numpy as np

from .config import DATA_DIR, INDEX_PATH, META_PATH, MIN_SCORE, TOP_K
from .corpus_loader import load_chunks

TOKEN_RE = re.compile(r"[\w\u0900-\u097F]+", re.UNICODE)


def tokenize(text: str) -> list[str]:
    return [t.lower() for t in TOKEN_RE.findall(text) if len(t) > 1]


def _build_tfidf(docs: list[list[str]]) -> tuple[dict[str, int], np.ndarray, np.ndarray]:
    """Return vocab map, normalized TF-IDF matrix, and idf vector."""
    df: Counter[str] = Counter()
    for tokens in docs:
        df.update(set(tokens))
    vocab = {term: i for i, term in enumerate(sorted(df.keys()))}
    n_docs = len(docs)
    n_terms = len(vocab)
    idf = np.zeros(n_terms, dtype=np.float32)
    for term, idx in vocab.items():
        idf[idx] = math.log((1 + n_docs) / (1 + df[term])) + 1.0

    matrix = np.zeros((n_docs, n_terms), dtype=np.float32)
    for row, tokens in enumerate(docs):
        counts = Counter(tokens)
        length = sum(counts.values()) or 1
        for term, count in counts.items():
            col = vocab.get(term)
            if col is None:
                continue
            tf = count / length
            matrix[row, col] = tf * idf[col]
        norm = np.linalg.norm(matrix[row])
        if norm > 0:
            matrix[row] /= norm
    return vocab, matrix, idf


def build_index() -> dict[str, Any]:
    chunks = load_chunks()
    if not chunks:
        raise RuntimeError(
            "No corpus chunks found. Add markdown under research/corpus or services/ml/seed_corpus."
        )
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    tokenized = [tokenize(c.text) for c in chunks]
    vocab, matrix, idf = _build_tfidf(tokenized)
    np.savez_compressed(
        INDEX_PATH,
        embeddings=matrix,
        idf=idf,
        vocab_keys=np.array(list(vocab.keys()), dtype=object),
    )
    meta = [
        {
            "chunk_id": c.chunk_id,
            "source": c.source,
            "section": c.section,
            "text": c.text,
            "theme_ids": c.theme_ids,
        }
        for c in chunks
    ]
    META_PATH.write_text(json.dumps(meta, ensure_ascii=False, indent=2), encoding="utf-8")
    return {"chunks": len(chunks), "path": str(INDEX_PATH), "backend": "tfidf-numpy"}


def _load_store() -> tuple[np.ndarray, np.ndarray, dict[str, int], list[dict]]:
    if not INDEX_PATH.exists() or not META_PATH.exists():
        build_index()
    data = np.load(INDEX_PATH, allow_pickle=True)
    embeddings = data["embeddings"]
    idf = data["idf"]
    vocab_keys = data["vocab_keys"].tolist()
    vocab = {str(k): i for i, k in enumerate(vocab_keys)}
    meta = json.loads(META_PATH.read_text(encoding="utf-8"))
    return embeddings, idf, vocab, meta


def _embed_query(query: str, vocab: dict[str, int], idf: np.ndarray) -> np.ndarray:
    tokens = tokenize(query)
    counts = Counter(tokens)
    length = sum(counts.values()) or 1
    vec = np.zeros(len(vocab), dtype=np.float32)
    for term, count in counts.items():
        col = vocab.get(term)
        if col is None:
            continue
        vec[col] = (count / length) * float(idf[col])
    norm = np.linalg.norm(vec)
    if norm > 0:
        vec /= norm
    return vec


def retrieve(query: str, top_k: int = TOP_K) -> list[tuple[float, dict]]:
    embeddings, idf, vocab, meta = _load_store()
    q = _embed_query(query, vocab, idf)
    scores = embeddings @ q
    order = np.argsort(-scores)[:top_k]
    results: list[tuple[float, dict]] = []
    for i in order:
        score = float(scores[i])
        # TF-IDF scores can be lower than MiniLM; keep a softer floor
        floor = min(MIN_SCORE, 0.05)
        if score < floor:
            continue
        results.append((score, meta[int(i)]))
    return results


def ensure_index() -> None:
    if not INDEX_PATH.exists() or not META_PATH.exists():
        build_index()
