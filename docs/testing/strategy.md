# Testing strategy (hackathon-realistic)

## Must verify before demo

1. **Happy path:** Hinglish symptom cluster → themes include cycle/hirsutism/weight (or subset) → disclaimer present → sources non-empty when corpus exists.
2. **Red flag:** Heavy bleeding + dizziness → `care.urgency === urgent` and `red_flags.length > 0`.
3. **Fallback:** Stop ML service → `/api/chat` still returns valid JSON (no crash, no diagnosis language).
4. **Ownership:** PR diffs stay inside role paths (manual checklist).

## Role tests (when code exists)

| Role | Tests |
|------|-------|
| ML | Unit tests for red-flag rules + theme mapping; retrieve smoke on sample query |
| UI | Render mock contract JSON; red-flag panel visible |
| Research | Manual review: every `THEME_IDS` entry has corpus coverage |
| Integration | Contract schema validate response; proxy timeout behavior |

## Out of scope for hour 5

Full e2e suite, load tests, medical accuracy clinical trial.
