# FULL PROMPT — Install & initialize ADCE (everyone, do this FIRST)

**How to use:** After cloning the Saheli repo and checking out your branch, paste **everything inside the fence below** into your coding agent.  
When it finishes, paste your **role FULL prompt** (`FULL_ui.md` / `FULL_ml.md` / `FULL_research.md` / `FULL_integration.md`).

```text
# ROLE
You are setting up ADCE (Artifact-Driven Context Engine) for this teammate on the Saheli hackathon repo.
Do ONLY ADCE install + project init/scan/doctor. Do NOT build product features yet.
Do NOT edit apps/, services/, or research/corpus during this setup.
When setup is verified, tell me which role FULL prompt to paste next.

# GOAL
1) Install the `adce` CLI globally
2) Initialize/repair ADCE in this repo if needed
3) Scan artifacts and confirm doctor + context work
4) Stop and hand off to the role prompt

# CONSTRAINTS
- Offline-friendly is fine (no ML server required for this hackathon)
- No destructive git (no force push, no reset --hard)
- Do not overwrite filled knowledge docs with empty stubs

# STEP 1 — Prerequisites
- Confirm Node.js works (`node -v`). Prefer Node 22+. If missing, tell the human to install it and stop.
- Confirm we are in the Saheli repo root (docs/, AGENTS.md, apps/, research/, services/).

# STEP 2 — Install ADCE CLI
Check: `adce --version`

If missing or broken, install with:

```powershell
npm install -g adce-cli
adce --version
```

Notes:
- Package name is `adce-cli`; the command is still `adce`.
- Do NOT install the unrelated npm package named only `adce`.

If global install fails (permissions), retry with an elevated terminal or fix npm prefix, then re-run `adce --version`. Keep trying until `adce` runs.

# STEP 3 — Initialize this repo
From Saheli repo root:

```powershell
adce doctor
```

- Not initialized → `adce init -y`
- Incomplete → `adce init --repair` only if doctor says so
- Already healthy → do not wipe existing requirements/design/architecture/etc.

Then:

```powershell
adce scan --full
adce structure
adce conflicts
adce status
```

Skip `adce login` / ML server unless the team explicitly shared `ADCE_ML_URL`. Core works offline; use `--skip-ml` later if needed.

# STEP 4 — Smoke-test context
```powershell
adce context --task "Saheli PCOS non-diagnostic local RAG setup smoke test" --format markdown
```

Confirm MUST READ / CAUTION / TRUST ORDER sections appear (empty lists are OK).

# STEP 5 — Report back
Checklist for the human:
- [ ] `adce --version` works
- [ ] `adce doctor` has no errors
- [ ] `adce scan --full` completed
- [ ] `adce context` returns markdown
- [ ] Next: paste role prompt from docs/agents/prompts/
    - research → FULL_research.md
    - ui → FULL_ui.md
    - ml → FULL_ml.md
    - dev → FULL_integration.md

# DO NOT DO YET
- No UI / ML / Research / API feature work
- No commits unless the human asks (`.adce/` is usually gitignored)
- Do not change directory ownership rules

# START
Install with `npm install -g adce-cli`, then run doctor → init if needed → scan → context. Stop when green and tell me to paste my role prompt.
```
