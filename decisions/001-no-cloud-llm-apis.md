# ADR 001  No cloud LLM APIs

## Status

Accepted

## Context

Hackathon demo must work without API keys/billing. Team hardware is local (16 GB RAM, GTX 1650).

## Decision

Forbid OpenAI/Anthropic/Gemini/Groq and similar hosted LLM HTTP APIs. Use local retrieval + templates; optional localhost Ollama only.

## Consequences

- Predictable demo
- Slightly less fluent replies unless Ollama is running
- Clearer safety control via templates
