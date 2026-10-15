from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .indexer import build_index, ensure_index
from .models import AnalyzeRequest, AnalyzeResponse
from .pipeline import analyze

app = FastAPI(
    title="Sakhi ML Analyze",
    description="Local RAG over research/seed corpus. Non-diagnostic education only.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def _startup() -> None:
    ensure_index()


@app.get("/health")
def health() -> dict:
    return {"ok": True, "service": "sakhi-ml"}


@app.post("/analyze", response_model=AnalyzeResponse)
def post_analyze(body: AnalyzeRequest) -> AnalyzeResponse:
    try:
        return analyze(body)
    except Exception as exc:  # noqa: BLE001 — return safe message to BFF
        raise HTTPException(status_code=500, detail=str(exc)) from exc


@app.post("/reindex")
def reindex() -> dict:
    info = build_index()
    return {"ok": True, **info}
