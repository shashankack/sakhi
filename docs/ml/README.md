# ML docs

**Branch:** `ml`  
**Owns:** `services/ml/**`, `docs/ml/**`

## Goal

Local analyze service: red flags + RAG over `research/corpus` + templates (+ optional Ollama). No cloud LLM APIs.

## Planned run

```bash
cd services/ml
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Update this file when the actual module path exists.
