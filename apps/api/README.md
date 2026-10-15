# apps/api

**Owner:** Integration  
**Branch:** `dev`  
Do not edit if you are not Integration. See `docs/contracts/DIRECTORY_OWNERS.md`.

BFF for Sakhi. Public `POST /api/chat` proxies to ML `POST http://127.0.0.1:8001/analyze`. If ML is down, returns a safe template fallback (never diagnoses).

## Run

From repo root:

```powershell
npm install
npm run dev:api
```

Listens on **http://127.0.0.1:3001**

- `GET /health`
- `POST /api/chat` — see `docs/contracts/API_CONTRACT.md`

## Env

| Variable | Default |
|----------|---------|
| `API_PORT` | `3001` |
| `ML_ANALYZE_URL` | `http://127.0.0.1:8001/analyze` |
| `ML_TIMEOUT_MS` | `8000` |

## UI note

Point the web app at `http://127.0.0.1:3001/api/chat` (or same-origin proxy once wired).
