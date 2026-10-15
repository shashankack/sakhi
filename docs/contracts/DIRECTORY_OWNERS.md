# Directory Owners (hard boundaries)

**Last updated by:** Integration  
**Rule:** If your role is not listed as Owner, you must not create, modify, or delete files in that path.

| Path | Owner | Notes |
|------|-------|-------|
| `apps/web/**` | UI | Entire frontend app |
| `apps/api/**` | Integration | Public HTTP API / BFF |
| `services/ml/**` | ML | Local RAG + analysis service |
| `research/corpus/**` | Research | Markdown knowledge base |
| `scripts/**` | Integration | Run/demo scripts |
| `docs/ui/**` | UI | |
| `docs/ml/**` | ML | |
| `docs/research/**` | Research | |
| `docs/integration/**` | Integration | |
| `docs/contracts/**` | Integration | Shared contracts |
| `docs/git/**` | Integration | |
| `docs/implementation/**` | Integration | |
| `docs/tech-stack/**` | Integration | |
| `docs/agents/**` | Integration | Agent prompts |
| `docs/testing/**` | Integration | Testing strategy |
| `docs/README.md` | Integration | |
| `requirements/**` | Integration | ADCE product requirements |
| `design/**` | Integration | ADCE UX / copy intent |
| `architecture/**` | Integration | ADCE system architecture |
| `decisions/**` | Integration | ADRs |
| `security/**` | Integration | Safety / policy |
| `schemas/**` | Integration | JSON schemas |
| `openapi.yaml` | Integration | OpenAPI surface |
| `AGENTS.md` | Integration | ADCE agent instructions |
| Root config & root `README.md` | Integration | See CONFLICT_AVOIDANCE.md |

## Runtime read permissions (not write)

| Reader | May read at runtime |
|--------|---------------------|
| ML service | `research/corpus/**` (read-only) |
| Integration API | Calls ML over HTTP; should not parse corpus itself |
| UI | Only HTTP responses from Integration API |

## Placeholder READMEs

Every owned top-level folder must keep a one-paragraph README:

```md
# <Folder>
Owner: <Role>
Branch: <branch>
Do not edit if you are not the owner. See docs/contracts/DIRECTORY_OWNERS.md.
```
