# Saheli — PCOS Symptom Understanding (Hackathon)

Non-diagnostic women’s health tool: everyday / regional-language symptoms → clear education + care guidance, grounded in local Research docs.

**No cloud LLM APIs.** Local retrieval + templates (+ optional tiny Ollama).

## Start with docs

→ **[docs/README.md](docs/README.md)**

| Doc | Why |
|-----|-----|
| [Implementation plan](docs/implementation/IMPLEMENTATION_PLAN.md) | What we build in 5 hours |
| [Tech stack](docs/tech-stack/TECH_STACK.md) | Local-first stack + GPU notes |
| [Repo setup](docs/git/REPO_SETUP.md) | Create remote, 5 branches, protect `main` |
| [Ownership](docs/contracts/DIRECTORY_OWNERS.md) | Prevent merge conflicts |
| [Master agent prompt](docs/agents/MASTER_PROMPT.md) | Paste into every coding agent |

## Branches

| Branch | Role |
|--------|------|
| `main` | Protected |
| `dev` | Integration |
| `ui` | UI |
| `ml` | ML |
| `research` | Research corpus |

## Folder ownership (short)

- `apps/web` → UI  
- `apps/api` → Integration  
- `services/ml` → ML  
- `research/corpus` → Research  

Details: `docs/git/CONFLICT_AVOIDANCE.md`
