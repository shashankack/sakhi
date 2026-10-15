# ADR 002  Exclusive directory ownership

## Status

Accepted

## Context

Four teammates, low git experience, parallel coding agents. Shared files cause merge conflicts.

## Decision

Each role may write only to owned paths. Integration owns glue + contracts. Cross-needs go to `PROPOSALS.md`. Coding agents must refuse out-of-role edits.

## Consequences

- Fewer conflicts
- Slightly more coordination via Integration
- Clear PR review surface
