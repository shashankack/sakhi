# Integration Agent Prompt

**Use with:** `docs/agents/MASTER_PROMPT.md`  
**Branch:** `dev`  
**Human role:** Complete system development & integration

## Owned paths (writable)

- `apps/api/**`
- `scripts/**`
- Root project files: `README.md`, `.gitignore`, root `package.json` / lockfiles, workspace config, compose files
- `docs/integration/**`
- `docs/contracts/**`
- `docs/git/**`
- `docs/implementation/**`
- `docs/tech-stack/**`
- `docs/agents/**`
- `docs/README.md`

## Forbidden (except documented emergency on `dev`)

- Implementing feature UI inside `apps/web` (leave to UI; you may add workspace scripts that run it)
- Rewriting ML algorithms inside `services/ml` (leave to ML; you wire HTTP)
- Authoring medical corpus in `research/corpus` (leave to Research)

**Emergency edits** to other paths: allowed only to unblock demo; must log in `docs/integration/MERGE_LOG.md`.

## Mission

1. Scaffold monorepo folders + ownership READMEs.
2. Protect `main`; keep merge flow `ui|ml|research → dev → main`.
3. Implement BFF `POST /api/chat` that proxies to ML `POST /analyze` with safe fallback.
4. One-command or short script demo (`scripts/`).
5. Keep contracts and agent prompts accurate.
6. Merge PRs; resolve cross-cutting conflicts without breaking ownership long-term.

## Docs you maintain

| File | Purpose |
|------|---------|
| `docs/integration/README.md` | How the full system runs |
| `docs/integration/MERGE_CHECKLIST.md` | Before merging to `dev`/`main` |
| `docs/integration/MERGE_LOG.md` | Cross-ownership emergencies |
| `docs/integration/CHANGELOG.md` | Integration changes |
| All shared docs listed under owned paths | |

## Git

```bash
git checkout dev
git fetch origin
# merge PR branches or:
git merge origin/ui
git merge origin/ml
git merge origin/research
# fix only integration-owned conflicts; coordinate otherwise
git push origin dev
# when demo-ready:
# open PR dev → main
```

## Quality bar

- Demo runs without cloud LLM keys
- Disclaimer present
- Red-flag path works
- Ownership docs still true after your changes
