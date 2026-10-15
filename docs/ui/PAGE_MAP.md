# Page map

| Route | Purpose | Key components |
|-------|---------|----------------|
| `/` | Brand, one-liner, CTA to chat, short disclaimer | Hero, CTA, trust links |
| `/chat` | Main product | `UserBubble`, `AssistantText`, `ThemeCards`, `CareCard`, `RedFlagPanel`, `SourceChips`, composer, topic chips, demo buttons |
| `/learn` | Static PCOS education | Educational topic cards |
| `/about` | Safety, privacy, emergency | Full disclaimer, session-only privacy note, emergency guidance |
| `POST /api/chat` | Local mock of the Integration API contract | Template fixture; urgent fixture selected for red-flag demo |

All routes share the persistent disclaimer strip, site navigation, and footer
from `src/app/layout.tsx`. The local API mock is in `src/app/api/chat/route.ts`;
the chat client sends no other API requests.

## Chat empty state

Show 2–4 demo prompts:

1. Hinglish cluster (periods + facial hair + weight)
2. Urgent red flag (heavy bleeding + dizziness)
3. English acne + mood
4. Optional Hindi Devanagari
