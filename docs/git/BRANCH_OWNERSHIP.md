# Branch Ownership

## Branches

| Branch | Human role | Coding agent prompt |
|--------|------------|---------------------|
| `main` | Protected  no direct work |  |
| `dev` | Complete system / Integration | `docs/agents/prompts/integration-agent.md` |
| `ui` | UI developer | `docs/agents/prompts/ui-agent.md` |
| `ml` | ML developer | `docs/agents/prompts/ml-agent.md` |
| `research` | Research docs | `docs/agents/prompts/research-agent.md` |

## Absolute rule

**A person (or their coding agent) may only modify files under their owned paths.**  
If a task seems to require another role’s files, they must:

1. Document the need in their own `docs/<role>/` notes, and  
2. Ask Integration to coordinate  **not** edit the other path.

This rule exists so merge conflicts are structurally rare, even if prompts are vague.

## Owned paths (summary)

See full table: [contracts/DIRECTORY_OWNERS.md](../contracts/DIRECTORY_OWNERS.md)

| Role | May write |
|------|-----------|
| Research | `research/corpus/**`, `docs/research/**` |
| UI | `apps/web/**`, `docs/ui/**` |
| ML | `services/ml/**`, `docs/ml/**` |
| Integration | `apps/api/**`, `scripts/**`, root config (`package.json`, `README.md`, `.gitignore`, lockfiles at root), `docs/integration/**`, `docs/contracts/**`, `docs/git/**`, `docs/implementation/**`, `docs/tech-stack/**`, `docs/agents/**`, `docs/README.md` |

## Shared contracts

- `docs/contracts/API_CONTRACT.md` and `THEME_IDS.md` are **Integration-owned**.
- Research/UI/ML may propose changes by writing a short note in their `docs/<role>/PROPOSALS.md`.
- Integration applies contract changes on `dev` after verbal/team agreement.
