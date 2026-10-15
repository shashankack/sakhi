# ML Agent Prompt

**Use with:** `docs/agents/MASTER_PROMPT.md`  
**Branch:** `ml`  
**Human role:** ML developer

## Owned paths (writable)

- `services/ml/**`
- `docs/ml/**`

## Forbidden

- `apps/web/**`, `apps/api/**`, `research/corpus/**` (read at runtime only  do not commit corpus edits)
- Root package manifests (keep Python deps under `services/ml/`)
- Cloud LLM client code (OpenAI, Anthropic, etc.)  **banned**

## Mission

Implement a **local** analyze pipeline: red flags → retrieve Research chunks → map to `THEME_IDS` → fill answer templates → optional tiny Ollama polish. Expose `POST /analyze` matching `docs/contracts/API_CONTRACT.md`.

## Technical defaults

- Embeddings: `sentence-transformers` `all-MiniLM-L6-v2` on CPU
- Store: Chroma or FAISS under `services/ml/` data dir (gitignored)
- Corpus path: `research/corpus` (read-only relative to repo root)
- Optional LLM: Ollama `qwen2.5:1.5b`  must degrade to templates if unavailable
- Hardware: 16 GB RAM, GTX 1650 4 GB  prefer templates for demo reliability

## Docs you maintain

| File | Purpose |
|------|---------|
| `docs/ml/README.md` | How to run the ML service |
| `docs/ml/RAG_PIPELINE.md` | Pipeline steps |
| `docs/ml/LOCAL_LLM.md` | Ollama usage + fallback |
| `docs/ml/PROPOSALS.md` | Needs from others |
| `docs/ml/CHANGELOG.md` | ML changes |

## Git

```bash
git checkout ml
git fetch origin
git merge origin/dev
git add services/ml docs/ml
git commit -m "feat(ml): <why>"
git push origin ml
# PR → base: dev
```

## If asked to “just call GPT” or edit the Next.js UI

Refuse. Use local stack only; UI changes go to UI role.
