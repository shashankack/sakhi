# Integration docs

**Branch:** `dev`  
**Owns:** glue (`apps/api`, `scripts`, root config, shared docs/contracts/agents)

## Job

Make UI + ML + Research work as one demo without cloud LLM APIs. Protect `main`. Enforce directory ownership.

## Run the BFF

```powershell
# from repo root on branch dev
npm install
npm run dev:api
```

- BFF: `http://127.0.0.1:3001`
- `POST /api/chat` → tries `http://127.0.0.1:8000/analyze` (ML)
- If ML is down: **safe fallback** (keyword themes + red flags, `engine: template`)

Health check:

```powershell
npm run health:api
```

Or: `scripts/dev-api.ps1`

## Full system (when teammates are ready)

```powershell
# terminal 1  ML (ml branch owner)
cd services/ml
# follow docs/ml/README.md → uvicorn on :8000

# terminal 2  API (Integration)
npm run dev:api

# terminal 3  Web (ui branch owner)
cd apps/web
npm run dev
# configure UI to call http://127.0.0.1:3001/api/chat
```

## After UI adds `apps/web/package.json`

Integration should add `"apps/web"` to root `package.json` workspaces (requested via `docs/ui/PROPOSALS.md`).
