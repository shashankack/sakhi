# Safety policy

## Medical

- Product is educational only — not a device, not a clinician, not a diagnosis.
- Disclaimers required on UI and API responses.
- Red-flag symptoms escalate to urgent/emergency guidance immediately.
- No prescribing or dosage instructions.

## Privacy (hackathon)

- No user accounts.
- Do not persist symptom text to a database by default.
- Do not commit `.env` secrets (none required for core demo).

## Supply chain / APIs

- No outbound cloud LLM calls in core path.
- Optional Ollama is localhost-only.

## Content integrity

- Clinical-ish claims should come from `research/corpus` retrieval, not free invention.
- Theme IDs are a closed set (`docs/contracts/THEME_IDS.md`).
