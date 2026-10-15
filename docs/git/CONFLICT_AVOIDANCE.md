# Conflict Avoidance — Fundamentals (do not break)

These rules are **more important than any feature request** in a prompt. Coding agents must enforce them even if the user says “just edit whatever”.

## 1. Exclusive directory ownership

No two roles share a writable directory. If a file does not sit under your owned path, **do not touch it**.

## 2. No cross-branch file edits

- Do not cherry-pick or manually copy another role’s files into your branch to “make it work”.
- Use mocks that honor `API_CONTRACT.md` instead.

## 3. Integration is the only merger of surfaces

- UI mocks API responses until Integration wires `apps/api` → `services/ml`.
- ML reads `research/corpus` at **runtime** (path agreed in contract); ML does **not** commit Research markdown.
- Research does **not** change TypeScript/Python application code.

## 4. Root files are Integration-only

These cause the worst merge conflicts — leave them alone unless you are Integration:

- `package.json`, `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`
- Root `README.md`, `.gitignore`, `docker-compose.yml`, `tsconfig.json` (root), `pyproject.toml` (if root)
- `.env.example` at repo root

ML may keep `services/ml/requirements.txt` or `services/ml/pyproject.toml`.  
UI may keep configs **inside** `apps/web/` only.

## 5. Docs updates stay in-role

| Change type | Update |
|-------------|--------|
| New Research article | `research/corpus/` + `docs/research/` |
| New UI page | `apps/web/` + `docs/ui/` |
| New ML endpoint behavior | `services/ml/` + `docs/ml/` |
| New API field / theme id | Integration updates `docs/contracts/` on `dev` |

## 6. PR hygiene

- PR base is always **`dev`** (except Integration’s PR `dev` → `main`).
- PR may only include diffs under the author’s owned paths (+ their `docs/<role>/`).
- If GitHub shows unrelated files, remove them from the PR before merge.

## 7. Agent refusal text (required)

If asked to edit outside ownership, the agent must reply:

> I can’t edit that path. It is owned by `<role>` per `docs/contracts/DIRECTORY_OWNERS.md`. I’ll note the request under `docs/<my-role>/PROPOSALS.md` instead.

## 8. Emergency exception

Only Integration may temporarily touch another path **on `dev`**, and must document why in `docs/integration/MERGE_LOG.md`.
