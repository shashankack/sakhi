# RAG pipeline

```text
message
  → language hint (en/hi/hinglish)
  → red-flag regex / rules
  → embed query (MiniLM, CPU)
  → retrieve top-k chunks from research/corpus index
  → map chunks → THEME_IDS
  → fill response templates (reply, themes, care, sources)
  → optional: Ollama polish of `reply` only
  → return API_CONTRACT JSON
```

## Indexing

- Rebuild index when corpus files change (script under `services/ml/`).
- Do not commit vector DB files; gitignore `.chroma/` / `data/`.

## Failure modes

| Failure | Behavior |
|---------|----------|
| Empty retrieval | Generic educational reply + “see a clinician”; empty or low-confidence themes |
| Ollama down | `engine: "template"` |
| Corpus missing | Clear error to Integration; Integration serves fallback |
