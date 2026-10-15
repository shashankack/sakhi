# UI docs

**Branch:** `ui`  
**Owns:** `apps/web/**`, `docs/ui/**`

## Run locally

```bash
cd apps/web
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run lint` and `npm run build` from
`apps/web` to validate the frontend.

## Routes and behavior

- `/` introduces Aai and links to chat and learning.
- `/chat` sends only `POST /api/chat`, shows four composer demo prompts,
  optional theme chips, response cards, and an urgent panel before education
  when `red_flags` is non-empty.
- `/learn` contains static educational information.
- `/about` explains limitations, session-only conversation handling, and when
  to seek urgent help.

The local `apps/web/src/app/api/chat/route.ts` is a same-origin mock of the
Integration contract. It returns template responses and does not call a cloud
LLM or read the research corpus. Conversation history exists in page memory
only.

The persistent disclaimer says “This is not a medical diagnosis.” Response
language, engine, and disclaimer are rendered from the API response.

## UI components and interaction details

shadcn/ui is configured in `apps/web/components.json`; generated primitives
live in `apps/web/src/components/ui`. The chat uses its buttons, cards, badges,
textarea, and tooltips, styled with the shared Aai color variables.

Framer Motion powers chat entry, loading, and response transitions while
respecting reduced-motion preferences. Topic chips include helper tooltips,
`Ctrl/Cmd + Enter` submits the composer, and “New conversation” clears the
current in-memory session without making an API request.

The visual system uses the supplied Lunara references for warm cream surfaces,
plum/berry and sage accents, rounded cards, and Fraunces / Plus Jakarta Sans
typography. These references inform styling only; Aai does not track cycles
or make fertility predictions.
