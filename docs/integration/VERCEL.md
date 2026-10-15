# Deploy Saheli frontend on Vercel (chat + RAG only)

Frontend on Vercel. Your laptop runs **RAG + BFF** behind one Cloudflare tunnel.  
STT / Whisper is **not** used.

```text
Browser (*.vercel.app)
  → POST /api/chat  (Next.js on Vercel)
  → CHAT_API_URL    (cloudflared → your :3001)
  → RAG             (your :8000)
```

## Vercel project settings

| Setting | Value |
|---------|--------|
| Framework | **Next.js** |
| Root Directory | **`apps/web`** |
| Build Command | `npm run build` (default) |
| Install Command | `npm install` (default) |
| Node.js | **20.x** or **22.x** |

## Environment variable (only one)

| Name | Example |
|------|---------|
| `CHAT_API_URL` | `https://brilliant-shirts-director-pixel.trycloudflare.com/api/chat` |

- Server-only (not `NEXT_PUBLIC_*`)
- After changing: **Redeploy**
- If cloudflared restarts, URL changes → update env → Redeploy

Do **not** set `STT_API_URL`.

## Your PC (before / during demo)

**Terminal 1 — RAG**
```powershell
cd C:\crucifer\Hackathons\chaos\services\ml
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000
```

**Terminal 2 — BFF**
```powershell
cd C:\crucifer\Hackathons\chaos
npm run dev:api
```

**Terminal 3 — tunnel**
```powershell
cloudflared tunnel --url http://127.0.0.1:3001
```

Copy the `https://….trycloudflare.com` URL and set:

```text
CHAT_API_URL=https://….trycloudflare.com/api/chat
```

## Deploy steps

1. Push is already on `main` / `dev` (pull latest if needed).
2. Vercel → Import `shashankack/sakhi` (or existing project).
3. Root Directory = `apps/web`.
4. Add `CHAT_API_URL`.
5. Deploy.
6. Open `https://<project>.vercel.app/chat` and send a Hinglish test message.

## Without tunnel

Leave `CHAT_API_URL` unset → built-in template fallback (site still works, weaker answers).
