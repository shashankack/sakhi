# services/ml  Local RAG

**Owner:** RAG lead (Integration lead for this hackathon)  
**STT teammate:** only `services/ml/stt/**`

Non-diagnostic `/analyze` service: **NumPy TF-IDF RAG** over `research/corpus` (preferred) and `seed_corpus` (bootstrap). No cloud LLMs; no torch required.

## Setup

```powershell
cd services/ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Run

```powershell
cd services/ml
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8001
```

Port **8001** by default so a teammate model can use **8000**. BFF expects `http://127.0.0.1:8001/analyze`.

- `GET /health`
- `POST /analyze`  same JSON as `docs/contracts/API_CONTRACT.md`
- `POST /reindex`  rebuild after corpus changes

Rebuild CLI:

```powershell
python scripts/rebuild_index.py
```

## Corpus

1. Prefer markdown in `research/corpus/` (Research branch).
2. Bootstrap content lives in `services/ml/seed_corpus/` so demos work before Research merges.

## Optional Ollama polish

In `app/config.py` set `OLLAMA_ENABLED = True` and pull `qwen2.5:1.5b`. Templates always work if Ollama is down.
