# Product requirements  Aai (PCOS symptom understanding)

## Problem statement

Build a tool that turns everyday descriptions of symptoms—including regional-language inputs—into understandable information and guidance toward appropriate care, particularly for PCOS. **It must not present itself as diagnosing.**

## Goals

1. Accept free-text symptoms in English, Hindi, Hinglish, and Kannada.
2. Return plain-language educational themes related to PCOS (not a diagnosis).
3. Guide users toward appropriate care (routine / soon / urgent).
4. Ground answers in team Research corpus via **local RAG**.
5. Suggest nearby hospitals/clinics via browser geolocation + OpenStreetMap (no API key).
6. Show live local weather with comfort precautions (Open-Meteo, no API key).
7. Optionally deep-link to quick commerce (Blinkit / Zepto / Instamart) for comfort essentials  no in-app checkout.
8. Remain demoable in a hackathon with a team of 4.

## Non-goals

- Medical diagnosis or “you have PCOS” language
- Prescriptions, lab ordering, telemedicine booking, or placing commerce orders on the user’s behalf
- Cloud LLM APIs (OpenAI, Anthropic, Gemini, Groq, etc.)
- User accounts / EHR sync / native apps
- Fine-tuning large models on GTX 1650 during the hackathon

## Success criteria (demo)

- Hinglish happy-path chat returns themes + care questions + sources
- Red-flag input shows urgent guidance first
- Works without any cloud API key
- `main` protected; work merges via `dev`
