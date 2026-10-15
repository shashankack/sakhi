# ML docs (RAG)

**RAG owner:** Integration lead for this hackathon  
**STT:** `services/ml/stt/**` only on `ml` branch

## Run RAG service

```powershell
cd services/ml
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

BFF (`apps/api`) proxies to this at `http://127.0.0.1:8000/analyze`.

## Docs

- [RAG_PIPELINE.md](RAG_PIPELINE.md)
- [LOCAL_LLM.md](LOCAL_LLM.md)
