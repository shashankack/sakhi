# API Contract

**Owner:** Integration  
**Consumers:** UI (client), ML (implements analyze), Integration (BFF)

Change this file only on `dev` via Integration after team agreement. Propose changes in role `PROPOSALS.md` files.

## Public endpoint (UI → Integration)

`POST /api/chat`

### Request

```json
{
  "message": "periods 2 mahine se nahi aaye, chehre pe baal aa rahe hain",
  "history": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ],
  "locale": "auto"
}
```

| Field | Type | Notes |
|-------|------|-------|
| `message` | string | Required, 3–4000 chars |
| `history` | array | Optional; last 6 turns max recommended |
| `locale` | `"auto"` \| `"en"` \| `"hi"` | Default `"auto"` |

### Response `200`

```json
{
  "reply": "You mentioned late periods and facial hair. This is educational information, not a diagnosis.",
  "language": "hi",
  "themes": [
    {
      "id": "cycle_irregularity",
      "title": "Menstrual cycle changes",
      "summary": "…",
      "pcos_context": "…",
      "overlap": "…"
    }
  ],
  "care": {
    "urgency": "soon",
    "summary": "Book a routine visit with a GP or gynecologist…",
    "questions": [
      "Could my cycle pattern relate to ovulation changes?"
    ]
  },
  "sources": [
    { "title": "cycles-irregular.md", "section": "Overview" }
  ],
  "red_flags": [],
  "disclaimer": "This is not a medical diagnosis…",
  "engine": "template"
}
```

| Field | Notes |
|-------|-------|
| `themes[].id` | Must be in `THEME_IDS.md` |
| `care.urgency` | `routine` \| `soon` \| `urgent` |
| `red_flags` | Non-empty ⇒ UI shows urgency panel first |
| `engine` | `template` \| `local_llm` \| `hybrid` |
| `disclaimer` | Always present |

### Error `4xx/5xx`

```json
{ "error": "Human-readable message" }
```

## Internal endpoint (Integration → ML)

`POST http://127.0.0.1:8000/analyze`  
(Same JSON request/response as above, minus transport concerns.)

If ML is down, Integration returns a **safe fallback** response (`engine: "template"`, generic care summary, empty themes or keyword themes) and never invents a diagnosis.

## Non-negotiable response rules

1. Never include language like “you have PCOS” / “diagnosed with”.
2. Prefer uncertainty + clinician referral when retrieval is weak.
3. If `red_flags` non-empty, `care.urgency` must be `"urgent"`.
