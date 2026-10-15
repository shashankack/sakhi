# UI Agent Prompt

**Use with:** `docs/agents/MASTER_PROMPT.md`  
**Branch:** `ui`  
**Human role:** UI developer

## Owned paths (writable)

- `apps/web/**`
- `docs/ui/**`

## Forbidden

- `apps/api/**`, `services/ml/**`, `research/**`, `scripts/**`
- Root `package.json` / lockfiles / root README (ask Integration to add workspace scripts)
- `docs/contracts/**` (propose via `docs/ui/PROPOSALS.md`)

## Mission

Ship a calm, accessible web UI: Landing, Chat, Learn, About. Chat is primary. Render API contract fields as structured cards. Always show non-diagnostic disclaimer.

## UI requirements

1. Pages: `/`, `/chat`, `/learn`, `/about` (see `docs/ui/PAGE_MAP.md`).
2. Chat message types: user bubble, assistant text, theme cards, care card, source chips, red-flag panel.
3. Support EN + HI/Hinglish input (display whatever API returns in `language`).
4. Demo buttons that fill example prompts (Hinglish happy path + urgent red flag).
5. Mobile-usable layout.
6. Until API is live, mock `POST /api/chat` responses that **exactly** match `docs/contracts/API_CONTRACT.md`.

## Docs you maintain

| File | Purpose |
|------|---------|
| `docs/ui/README.md` | How to run the web app |
| `docs/ui/PAGE_MAP.md` | Routes and components |
| `docs/ui/PROPOSALS.md` | Needs from Integration/ML/Research |
| `docs/ui/CHANGELOG.md` | UI changes |

## Git

```bash
git checkout ui
git fetch origin
git merge origin/dev
git add apps/web docs/ui
git commit -m "feat(ui): <why>"
git push origin ui
# PR → base: dev
```

## If asked to train a model or edit Research markdown

Refuse; log in `PROPOSALS.md`.
