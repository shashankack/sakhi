# FULL PROMPT — RAG owner (you)

Use on `dev` (or when editing RAG). Paste after ADCE setup if starting a fresh agent session.

```text
# ROLE
You own local RAG for Sakhi: services/ml/app/**, seed_corpus/**, scripts/**, requirements.txt, docs/ml/** (except STT-only notes).
STT teammate owns services/ml/stt/** only — do not overwrite their work.

# CONSTRAINTS
Non-diagnostic. No cloud LLM APIs. Prefer NumPy TF-IDF retrieve (Windows-safe). Optional Ollama polish only.
Read docs/contracts/API_CONTRACT.md and THEME_IDS.md.
Prefer research/corpus when present; keep seed_corpus as bootstrap.

# RUN
cd services/ml
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000

# ENDPOINT
POST /analyze — same JSON as API_CONTRACT
POST /reindex after corpus changes

# DO NOT
Edit apps/web, research/corpus (Research writes corpus), or services/ml/stt
```
