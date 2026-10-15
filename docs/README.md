# Aai / PCOS Symptom Tool  Documentation Hub

This folder is the **source of truth** for the hackathon. Coding agents and humans must read the relevant docs before changing code, and **update docs when behavior or ownership changes**.

## Who reads what

| Role | Branch | Start here |
|------|--------|------------|
| Everyone (first) | any | **[agents/prompts/FULL_adce_setup.md](agents/prompts/FULL_adce_setup.md)** (`npm install -g adce-cli`) |
| Everyone |  | [agents/COPY_PASTE_FOR_TEAMMATES.md](agents/COPY_PASTE_FOR_TEAMMATES.md), [contracts/DIRECTORY_OWNERS.md](contracts/DIRECTORY_OWNERS.md) |
| Research | `research` | **[agents/prompts/FULL_research.md](agents/prompts/FULL_research.md)** |
| UI | `ui` | **[agents/prompts/FULL_ui.md](agents/prompts/FULL_ui.md)** |
| ML | `ml` | **[agents/prompts/FULL_ml.md](agents/prompts/FULL_ml.md)** |
| Integration | `dev` | **[agents/prompts/FULL_integration.md](agents/prompts/FULL_integration.md)** |

## Doc map

```
docs/
  README.md                          ← you are here
  implementation/IMPLEMENTATION_PLAN.md
  tech-stack/TECH_STACK.md
  testing/                           ← test strategy
  git/ | contracts/ | agents/
  research/ | ui/ | ml/ | integration/
```

## ADCE knowledge (repo root, Integration-owned)

Also maintained for ADCE `software-eng` structure:

- `requirements/` · `design/` · `architecture/` · `decisions/`
- `security/` · `schemas/` · `openapi.yaml`

Before edits: `adce context --task "..." --format markdown` → MUST READ → CAUTION → TRUST ORDER.

## Non‑negotiables

1. **Not a diagnosis tool**  education + care guidance only.
2. **No cloud LLM APIs**  local models / retrieval / templates only (see tech stack).
3. **Path ownership**  each role edits only their owned directories (see `DIRECTORY_OWNERS.md`). Integration is the only role that wires paths together.
4. **Docs stay current**  if you change behavior, update the matching doc in the same change set.

## Product one-liner

Describe symptoms in everyday or regional language → get understandable PCOS-related education and care next steps → never a diagnosis.
