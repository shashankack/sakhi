# ML changelog

## Unreleased

- Local RAG service: FastAPI `POST /analyze` on :8000
- Pure NumPy TF-IDF retrieve (Windows Application Control blocked scipy/torch path)
- Seed corpus under `services/ml/seed_corpus/` (bootstrap)
- Prefers `research/corpus` when Research adds files
- Red flags + theme mapping + template replies; optional Ollama polish hook
- STT isolated to `services/ml/stt/` for teammate
