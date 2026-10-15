# Integration docs

**Branch:** `dev`  
**Owns:** glue (`apps/api`, `scripts`, root config, shared docs/contracts/agents)

## Job

Make UI + ML + Research work as one demo without cloud LLM APIs. Protect `main`. Enforce directory ownership.

## Planned system run

```bash
# terminal 1 — ML
cd services/ml && <venv activate> && uvicorn ... --port 8000

# terminal 2 — web + BFF
npm run dev
```

Update exact commands here once scaffolded.
