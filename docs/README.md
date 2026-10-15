# Saheli / PCOS Symptom Tool — Documentation Hub

This folder is the **source of truth** for the hackathon. Coding agents and humans must read the relevant docs before changing code, and **update docs when behavior or ownership changes**.

## Who reads what

| Role | Branch | Start here |
|------|--------|------------|
| Everyone | — | [git/BRANCH_OWNERSHIP.md](git/BRANCH_OWNERSHIP.md), [contracts/DIRECTORY_OWNERS.md](contracts/DIRECTORY_OWNERS.md), [agents/MASTER_PROMPT.md](agents/MASTER_PROMPT.md) |
| Research | `research` | [research/README.md](research/README.md), [agents/prompts/research-agent.md](agents/prompts/research-agent.md) |
| UI | `ui` | [ui/README.md](ui/README.md), [agents/prompts/ui-agent.md](agents/prompts/ui-agent.md) |
| ML | `ml` | [ml/README.md](ml/README.md), [agents/prompts/ml-agent.md](agents/prompts/ml-agent.md) |
| Integration | `dev` | [integration/README.md](integration/README.md), [agents/prompts/integration-agent.md](agents/prompts/integration-agent.md) |

## Doc map

```
docs/
  README.md                          ← you are here
  implementation/IMPLEMENTATION_PLAN.md
  tech-stack/TECH_STACK.md
  git/
    REPO_SETUP.md                    ← create repo, branches, protect main
    BRANCH_OWNERSHIP.md
    CONFLICT_AVOIDANCE.md
  contracts/
    DIRECTORY_OWNERS.md              ← hard ownership boundaries
    API_CONTRACT.md
    THEME_IDS.md
  agents/
    MASTER_PROMPT.md                 ← paste into every coding agent first
    prompts/                         ← role-specific agent prompts
  research/ | ui/ | ml/ | integration/
```

## Non‑negotiables

1. **Not a diagnosis tool** — education + care guidance only.
2. **No cloud LLM APIs** — local models / retrieval / templates only (see tech stack).
3. **Path ownership** — each role edits only their owned directories (see `DIRECTORY_OWNERS.md`). Integration is the only role that wires paths together.
4. **Docs stay current** — if you change behavior, update the matching doc in the same change set.

## Product one-liner

Describe symptoms in everyday or regional language → get understandable PCOS-related education and care next steps → never a diagnosis.
