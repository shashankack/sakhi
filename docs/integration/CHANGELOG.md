# Integration changelog

## Unreleased

- BFF `apps/api`: `POST /api/chat` + `GET /health` on port 3001
- Proxies to ML `:8000/analyze` with timeout; safe template fallback if ML down
- Fallback includes red-flag detection + basic theme keyword hints (non-diagnostic)
- Root `package.json` workspace for `@sakhi/api`; scripts `dev:api`, `health:api`
- `scripts/dev-api.ps1`, `scripts/health-api.mjs`
