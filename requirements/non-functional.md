# Non-functional requirements

## NFR-1 No cloud LLM APIs

All inference/retrieval is local. Optional Ollama only on localhost.

## NFR-2 Hardware target

16 GB RAM, Intel i5 11th gen, GTX 1650 (~4 GB VRAM). Prefer CPU MiniLM embeddings + templates; optional `qwen2.5:1.5b`.

## NFR-3 Merge-conflict avoidance

Exclusive directory ownership per role (`docs/contracts/DIRECTORY_OWNERS.md`). Agents must refuse out-of-role edits.

## NFR-4 Privacy

No login; session-only symptom text; no PHI datastore for hackathon demo.

## NFR-5 Reliability

Demo must succeed with template engine if Ollama is down.

## NFR-6 Documentation currency

Behavior changes update the matching role docs / ADCE knowledge files in the same change set.
