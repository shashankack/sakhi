# RAG pipeline (implemented)

```text
message
  → language hint (en/hi/hinglish)
  → red-flag rules
  → TF-IDF embed query (pure NumPy — Windows-safe; no sklearn/torch required)
  → cosine top-k over index (research/corpus ∪ seed_corpus)
  → map theme_ids + keyword boost → THEME_IDS
  → fill reply / themes / care / sources / disclaimer
  → optional Ollama polish of reply only
  → AnalyzeResponse JSON
```

## Index files (gitignored)

- `services/ml/data/index.npz`
- `services/ml/data/chunks.json`

Rebuild: `POST /reindex` or `python scripts/rebuild_index.py`

## Failure modes

| Failure | Behavior |
|---------|----------|
| Empty corpus | Startup/reindex error; BFF uses its own fallback |
| Weak scores | Fewer themes + clinician guidance |
| Ollama down | `engine: template` |
