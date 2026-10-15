# System architecture

## Components

```text
Browser
  └─ apps/web (UI) ──POST /api/chat──► apps/api (Integration BFF)
                                            │
                                            ▼
                                      services/ml (ML)
                                            │ read-only
                                            ▼
                                      research/corpus
```

## Responsibilities

| Component | Owner | Duty |
|-----------|-------|------|
| `apps/web` | UI | Pages, chat UI, render contract JSON |
| `apps/api` | Integration | Auth-less BFF, fallback if ML down |
| `services/ml` | ML | Red flags, embeddings, retrieve, templates, optional Ollama |
| `research/corpus` | Research | Educational markdown knowledge |

## Analyze pipeline (ML)

1. Language hint  
2. Red-flag rules  
3. Embed query (MiniLM CPU)  
4. Top-k chunks from corpus index  
5. Map to `THEME_IDS`  
6. Fill templates → optional local LLM polish of `reply`  
7. Return `API_CONTRACT` JSON  

## Tech defaults

See `docs/tech-stack/TECH_STACK.md`. No cloud LLM APIs.
