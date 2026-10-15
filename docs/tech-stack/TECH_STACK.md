# Tech Stack

**Policy:** No cloud LLM APIs. Prefer local, free, demo-reliable tools. Hardware target: **16 GB RAM, Intel i5 11th gen, GTX 1650 (~4 GB VRAM)**.

## Recommended stack (hackathon default)

| Layer | Choice | Why |
|-------|--------|-----|
| Web UI | **Next.js (App Router) + TypeScript + Tailwind** | Fast pages, simple API routes for Integration |
| API / glue | **Next.js Route Handlers** in `apps/api` *or* thin FastAPI sidecar owned by Integration | One process for demo is easiest |
| Research corpus | **Markdown files** in `research/corpus/` | Human-editable, git-friendly, RAG-ready |
| Retrieval | **Pure NumPy TF-IDF** over markdown chunks (default) | No torch/sklearn  reliable on locked-down Windows; swap to MiniLM later if desired |
| Answer generation | **Template composer** (primary) + optional **Ollama** small model | Templates never fail at demo time |
| Optional local LLM | **Ollama** + `qwen2.5:1.5b` or `phi3:mini` (Q4) | See GPU notes below |
| Package mgr | **npm** (UI/Integration) + **Python 3.11+ venv** (ML) | Clear split by ownership |
| Embeddings runtime | **Python** (`sentence-transformers`, `chromadb`) | ML-owned service |

## What we deliberately do **not** use

- OpenAI / Anthropic / Google / Groq / Together / any hosted LLM HTTP API
- Hosted vector DBs (Pinecone, Weaviate cloud)
- Fine-tuning / LoRA on 1650 during the hackathon

## Local LLM on this hardware

### Reality check (GTX 1650, 4 GB VRAM)

| Model (Ollama) | Feasible? | Notes |
|----------------|-----------|-------|
| `qwen2.5:0.5b` / `1.5b` Q4 | **Yes** | Best fit for 4 GB VRAM; short replies only |
| `phi3:mini` Q4 | **Maybe** | May spill to RAM/CPU; slower |
| `llama3.2:3b` Q4 | **Tight** | Often CPU-bound or OOM on 4 GB |
| `7B+` models | **No** for interactive demo | Too heavy for reliable live demos |

**Guidance:** Treat generative LLM as **optional polish**. Ship a **retrieval + template** answer path that always works. If Ollama is up, ML may rewrite the template reply for fluency; if not, return templates unchanged.

### Suggested Ollama setup (optional, ML machine)

```bash
# Install Ollama from https://ollama.com (local only)
ollama pull qwen2.5:1.5b
ollama run qwen2.5:1.5b
```

Keep context short (retrieved chunks only). Cap `num_predict` low (128–256 tokens).

## ML service sketch

- `POST /analyze` (internal, localhost)  ML owns this
- Input/output must match `docs/contracts/API_CONTRACT.md` fields Integration expects
- Pipeline: normalize text → red-flag rules → embed query → top-k chunks → map to `THEME_IDS` → fill templates → optional local LLM polish

## UI sketch

- Next.js app in `apps/web`
- Talks **only** to Integration’s public `/api/chat`
- Never calls Ollama or Chroma directly

## Integration sketch

- Owns monorepo root scripts: `npm run dev`, `npm run ml:dev`, compose/docs for “how to run”
- May use Next.js API route as BFF that proxies to `http://127.0.0.1:8000`

## Why this fits a 5-hour hackathon

- No API keys, no billing, no network dependency for core demo
- CPU embeddings are enough for a small corpus (8–20 markdown files)
- Path ownership maps cleanly to npm vs Python folders (fewer merge conflicts)
