# ADR 003 — Chat-first with structured cards

## Status

Accepted

## Context

A free-form medical chatbot hallucinates and looks like a doctor. Judges need clear education + care steps.

## Decision

Primary UX is chat, but responses are structured (`themes`, `care`, `sources`, `red_flags`) and rendered as cards inside the thread.

## Consequences

- Safer UX
- UI and ML share a strict JSON contract
- Less “companion chatbot” fluff
