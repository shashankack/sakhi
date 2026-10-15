# Functional requirements

## FR-1 Multilingual symptom input

User can enter free text (EN / HI / Hinglish). Optional symptom chips append phrases.

## FR-2 Chat interface

Primary UX is `/chat`. Conversation shows reflective assistant replies plus structured cards.

## FR-3 Theme education

System maps input to fixed theme IDs (`docs/contracts/THEME_IDS.md`) with summary, PCOS context, and overlap notes.

## FR-4 Care guidance

Response includes urgency (`routine` | `soon` | `urgent`), care summary, and clinician questions.

## FR-5 Red flags

Detect urgent patterns (heavy bleeding + dizziness, severe pain, pregnancy concern, self-harm, chest/breath issues). Show red-flag panel before PCOS education.

## FR-6 Local RAG

Retrieve chunks from `research/corpus/**`. Cite sources in the response.

## FR-7 Non-diagnostic framing

Persistent disclaimer on UI and in every API response.

## FR-8 Fallback

If ML/local LLM unavailable, Integration returns safe template/fallback JSON matching the API contract.

## FR-9 Static pages

`/` landing, `/learn` education, `/about` safety/privacy.
