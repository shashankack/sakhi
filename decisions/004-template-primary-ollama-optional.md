# ADR 004  Templates primary, Ollama optional

## Status

Accepted

## Context

GTX 1650 has ~4 GB VRAM; large local models are unreliable for a live demo.

## Decision

Answer generation is template-filled from retrieved Research chunks. Optional Ollama (`qwen2.5:1.5b`) may polish `reply` only. If Ollama fails, return templates unchanged (`engine: template`).

## Consequences

- Demo always has a path
- Fluency is best-effort
- Theme IDs remain code/corpus controlled
