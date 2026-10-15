# Implementation Plan  Women’s Health Symptom Understanding (PCOS)

**Duration:** 5 hours · **Team:** 4 · **Constraint:** no cloud LLM APIs · **Stance:** non-diagnostic

## 1. Goal

Build a web tool that turns everyday / regional-language symptom descriptions into clear PCOS-focused **education** and **care guidance**, grounded in team Research docs via local RAG. It must never present itself as diagnosing.

## 2. Success criteria (hour 5)

- User can open `/chat`, type messy Hinglish/English symptoms, and get:
  - Reflective plain-language reply
  - Education theme cards (not diagnoses)
  - Care urgency + clinician questions
  - Sources from Research corpus
- Urgent red-flag input shows emergency guidance first
- Demo works **without** any external LLM API key
- `main` stays clean; work lands via `dev` after Integration review

## 3. Architecture (high level)

```
Browser (apps/web)
    │  POST /api/chat
    ▼
Integration API (apps/api)     ← owned by Integration
    │  calls local ML service
    ▼
ML service (services/ml)       ← owned by ML
    │  retrieves chunks
    ▼
Research corpus (research/corpus)  ← owned by Research
```

UI never imports ML internals. ML never edits UI files. Research never edits API/UI code. Integration owns glue only.

## 4. Pages

| Route | Owner | Purpose |
|-------|-------|---------|
| `/` | UI | Landing: brand, one-liner, disclaimer, CTA |
| `/chat` | UI | Chat UI + structured cards in-thread |
| `/learn` | UI | Static PCOS education (copy from Research summaries if needed  paste via Integration if shared) |
| `/about` | UI | Full disclaimer, privacy, emergency note |

## 5. Chat flow

1. User message (+ optional symptom chips)
2. API receives JSON (see `docs/contracts/API_CONTRACT.md`)
3. ML: language hint → red-flag check → retrieve top-k Research chunks → build answer (template + optional tiny local LLM)
4. Response: `reply`, `themes`, `care`, `sources`, `red_flags`, `disclaimer`
5. UI renders message types: text, theme cards, care card, sources, red-flag block

## 6. Feature tiers

### Must ship

- Multilingual free-text input (EN + HI/Hinglish)
- Chat UI with non-diagnostic disclaimer
- Theme extraction mapped to fixed `THEME_IDS`
- Care pathway + clinician questions
- Red-flag interrupt
- Local RAG over Research markdown
- Offline / template fallback if local model is down

### Add if time (max 2–3)

- Voice input (browser STT)
- Language toggle for replies
- Copy “questions for doctor”
- `/library` browse of Research titles
- Session summary drawer

### Explicitly out of scope

- Cloud LLM APIs (OpenAI, Anthropic, Gemini, etc.)
- Diagnosis, prescriptions, lab ordering
- Auth / EHR / telemedicine booking
- Fine-tuning large models on the GTX 1650

## 7. Timeline

| Window | Research | UI | ML | Integration |
|--------|----------|----|----|-------------|
| 0:00–0:20 | Theme list freeze | Wireframes | Confirm local stack | Repo, branches, protect `main`, scaffold dirs |
| 0:20–2:00 | Corpus v1 (8–12 md) | Landing + Chat shell + mock JSON | Embeddings + retrieve + template answers | Stub API returning mock; path wiring |
| 2:00–3:30 | Red flags + aliases | Real cards + mobile | Hook corpus; polish retrieval | Point API at ML; end-to-end |
| 3:30–4:30 | Source titles clean | Learn/About polish | Fallback reliability | Conflict check, demo script |
| 4:30–5:00 | Freeze corpus | Freeze UI | Freeze ML | Merge to `dev`, tag demo, rehearse |

## 8. Definition of done per role

- **Research:** corpus files + `docs/research/` updated; every theme_id has at least one doc section
- **UI:** all pages render; chat works against API contract (mock or live)
- **ML:** retrieve + answer without cloud APIs; red flags work; docs in `docs/ml/` updated
- **Integration:** `dev` runs one-command demo; ownership rules enforced in docs; PR notes for `main`

## 9. Doc update rule

Any behavior change ships with a doc update in the same PR/commit set under that role’s `docs/<role>/` folder. Integration updates `docs/contracts/` when the shared API or theme list changes (after team agreement).
