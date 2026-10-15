# apps/web

**Owner:** UI  
**Branch:** `ui`  
Do not edit if you are not the UI developer. See `docs/contracts/DIRECTORY_OWNERS.md`.

Sakhi's Next.js App Router frontend lives here. It includes the landing, chat,
learn, and about routes. The chat uses the local `POST /api/chat` fixture until
Integration provides the BFF implementation.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The chat fixture supports the demo prompts,
including the urgent bleeding-and-dizziness example.

## UI components and motion

The app uses shadcn/ui primitives configured in `components.json` and stored
under `src/components/ui`. Shared shadcn color variables are mapped to the
Sakhi palette in `src/app/globals.css`.

The visual system takes cues from the supplied Lunara references: warm cream
surfaces, plum and berry accents, sage details, rounded cards, and Fraunces /
Plus Jakarta Sans typography. These are visual treatments only; Sakhi does
not track cycles or make fertility predictions.

The chat uses Framer Motion for restrained message, loading, and empty-state
transitions. Reduced-motion preferences are respected. Composer shortcuts,
topic tooltips, and a session-only “New conversation” action are available on
the chat page.
