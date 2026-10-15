# Product requirements — Saheli (PCOS symptom understanding)

## Problem statement

Build a tool that turns everyday descriptions of symptoms—including regional-language inputs—into understandable information and guidance toward appropriate care, particularly for PCOS. **It must not present itself as diagnosing.**

## Goals

1. Accept free-text symptoms in English, Hindi, and Hinglish.
2. Return plain-language educational themes related to PCOS (not a diagnosis).
3. Guide users toward appropriate care (routine / soon / urgent).
4. Ground answers in team Research corpus via **local RAG**.
5. Remain demoable in a 5-hour hackathon with a team of 4.

## Non-goals

- Medical diagnosis or “you have PCOS” language
- Prescriptions, lab ordering, telemedicine booking
- Cloud LLM APIs (OpenAI, Anthropic, Gemini, Groq, etc.)
- User accounts / EHR sync / native apps
- Fine-tuning large models on GTX 1650 during the hackathon

## Success criteria (demo)

- Hinglish happy-path chat returns themes + care questions + sources
- Red-flag input shows urgent guidance first
- Works without any cloud API key
- `main` protected; work merges via `dev`
