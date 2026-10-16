# Aai — PCOS Symptom Understanding (Hackathon)

Non-diagnostic women’s health tool: everyday / regional-language symptoms → clear education + care guidance, grounded in local Research docs.

**No cloud LLM APIs.** Local retrieval + templates (+ optional tiny Ollama).

## Live demo

**Frontend (Vercel):** [https://sakhi-seven-sigma.vercel.app/](https://sakhi-seven-sigma.vercel.app/)

Chat on production talks to your laptop BFF via `CHAT_API_URL` (Cloudflare tunnel → `:3001` → RAG `:8001`). Deploy notes: [docs/integration/VERCEL.md](docs/integration/VERCEL.md).

## Start with docs

→ **[docs/README.md](docs/README.md)**

Teammate prompts: [docs/agents/COPY_PASTE_FOR_TEAMMATES.md](docs/agents/COPY_PASTE_FOR_TEAMMATES.md)

## Branches

| Branch | Role |
|--------|------|
| `main` | Protected |
| `dev` | Integration |
| `ui` | UI |
| `ml` | ML |
| `research` | Research corpus |

## Run locally

```powershell
npm install
npm run dev:api    # BFF :3001
npm run dev:web    # Next.js :3000
```

RAG (separate terminal):

```powershell
cd services/ml
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

- Web: `http://127.0.0.1:3000`
- API: `http://127.0.0.1:3001` — `POST /api/chat`, `GET /health`
- ML: `http://127.0.0.1:8001` — `POST /analyze`

## Folder ownership

- `apps/web` → UI  
- `apps/api` → Integration  
- `services/ml` → ML  
- `research/corpus` → Research  

Details: `docs/contracts/DIRECTORY_OWNERS.md`
