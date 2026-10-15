# Local LLM notes (optional)

**Hardware:** 16 GB RAM, i5-11th, GTX 1650 (~4 GB VRAM)

## Recommendation

1. **Primary:** template answers from retrieved chunks (always on).
2. **Optional polish:** Ollama `qwen2.5:1.5b` (Q4).
3. Avoid 7B+ models for live demo reliability.

## Prompt constraints if using Ollama

- Input = user message + retrieved chunks only.
- Output = short reflective paragraph; no diagnosis language.
- Do not let the model invent theme IDs — stick to retrieved/mapped IDs from code.

## Commands

```bash
ollama pull qwen2.5:1.5b
ollama list
```

Set env in `services/ml` only, e.g. `OLLAMA_MODEL=qwen2.5:1.5b`, `OLLAMA_ENABLED=true`.
