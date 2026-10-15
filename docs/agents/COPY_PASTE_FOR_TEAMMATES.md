# Copy-paste prompts for each teammate

## Order (important)

1. **First**  ADCE setup: [prompts/FULL_adce_setup.md](prompts/FULL_adce_setup.md)  
   Installs with `npm install -g adce-cli`, then `adce init` / `scan` / `context`.
2. **Second**  your role FULL prompt (table below).

Each person pastes **only the fenced `text` block** from the file.

## Role prompts

| Branch | Role | Paste this file |
|--------|------|-----------------|
| `research` | Research corpus | [prompts/FULL_research.md](prompts/FULL_research.md) |
| `ui` | UI developer | [prompts/FULL_ui.md](prompts/FULL_ui.md) |
| `ml` | STT teammate only | [prompts/FULL_ml.md](prompts/FULL_ml.md) |
| `dev` | Integration + RAG lead | [prompts/FULL_integration.md](prompts/FULL_integration.md) + [prompts/FULL_rag.md](prompts/FULL_rag.md) |

### Steps for each teammate

1. `git clone <repo>` then `git checkout <their-branch>`
2. Open Cursor in the repo root
3. Paste **FULL_adce_setup** → wait until `adce doctor` / `context` succeed
4. Paste their **FULL_\<role\>** prompt
5. Work only in owned paths; open PR → **base `dev`**

Shorter reference prompts: `prompts/research-agent.md`, `ui-agent.md`, `ml-agent.md`, `integration-agent.md`  
Master constraints: [MASTER_PROMPT.md](MASTER_PROMPT.md)
