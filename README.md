# Sakhi — PCOS Symptom Understanding (Hackathon)

Non-diagnostic women’s health tool: everyday / regional-language symptoms → clear education + care guidance, grounded in local Research docs.

**No cloud LLM APIs.** Local retrieval + templates (+ optional tiny Ollama).

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

## Run (Integration BFF)

```powershell
npm install
npm run dev:api
```

API: `http://127.0.0.1:3001`  
- `POST /api/chat` (proxies ML at `:8000`, safe fallback if ML is down)  
- `GET /health`

ML (when ready on `ml` branch): run `services/ml` on port **8000**.  
UI (when ready on `ui` branch): point chat client at `http://127.0.0.1:3001/api/chat`.

## Folder ownership

- `apps/web` → UI  
- `apps/api` → Integration  
- `services/ml` → ML  
- `research/corpus` → Research  

Details: `docs/contracts/DIRECTORY_OWNERS.md`
