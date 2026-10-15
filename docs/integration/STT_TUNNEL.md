# Vercel frontend + STT PC + API/RAG PC

**Deploy only the website on Vercel** (`*.vercel.app`).  
No custom domain for now. Backends stay on laptops via **Cloudflare Tunnel** (or ngrok).

```text
Browser on https://sakhi-xxxx.vercel.app
        │
        ├─ text ──────────────────────────────► [Your tunnel]  BFF :3001 → RAG :8000
        │
        └─ voice (audio) ──► [His tunnel]  Whisper → { text }
                                    then browser ──► [Your tunnel] /api/chat
```

**UI orchestration (recommended):**

1. Voice → `POST {STT_URL}/transcribe` → `{ "text": "..." }`  
2. Text (typed or from STT) → `POST {CHAT_URL}` → Sakhi JSON  

---

## Env vars on Vercel

Project → Settings → Environment Variables (Production):

| Name | Example |
|------|---------|
| `NEXT_PUBLIC_CHAT_URL` | `https://xxxx.trycloudflare.com/api/chat` |
| `NEXT_PUBLIC_STT_URL` | `https://yyyy.trycloudflare.com` |

After changing these, **redeploy** (required for `NEXT_PUBLIC_*`).

Quick tunnels change URL when restarted — update Vercel env + Redeploy, or use named tunnels for stable URLs.

---

## YOUR machine (API + RAG)

```powershell
# terminal 1 — RAG
cd C:\crucifer\Hackathons\chaos\services\ml
.\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000

# terminal 2 — BFF
cd C:\crucifer\Hackathons\chaos
npm run dev:api

# terminal 3 — public tunnel to BFF only
cloudflared tunnel --url http://127.0.0.1:3001
```

Copy the `https://….trycloudflare.com` URL → set as  
`NEXT_PUBLIC_CHAT_URL=https://….trycloudflare.com/api/chat`

Local check first:

```powershell
Invoke-RestMethod http://127.0.0.1:3001/api/chat -Method POST -ContentType "application/json" -Body '{"message":"periods late facial hair","locale":"auto"}'
```

Do **not** tunnel `:8000`.

---

## HIS machine (Whisper STT)

1. HTTP API, e.g. `POST /transcribe` → `{ "text": "..." }`  
2. **CORS** allow `https://*.vercel.app` (or `*` for hackathon)  
3. Tunnel:

```powershell
cloudflared tunnel --url http://127.0.0.1:9000
```

→ `NEXT_PUBLIC_STT_URL=https://….trycloudflare.com`

---

## Vercel (frontend only)

1. Import GitHub repo `shashankack/sakhi` (or deploy `apps/web` as root / monorepo setting).  
2. Root directory: `apps/web` (when UI exists).  
3. Framework: Next.js.  
4. Set the two `NEXT_PUBLIC_*` vars.  
5. Deploy → open `https://<project>.vercel.app`.

Until UI is merged, Vercel has nothing to host — UI teammate must push `apps/web` first.

---

## Demo boot order

1. You: RAG → API → cloudflared → copy CHAT URL into Vercel (redeploy if changed)  
2. Him: STT → cloudflared → copy STT URL into Vercel (redeploy if changed)  
3. Open `*.vercel.app` → text test → voice test  

Text-only still works if his STT tunnel dies.

---

## Checklist

- [ ] UI on `apps/web` pushed and Vercel project set to that folder  
- [ ] You: `:8000` + `:3001` + tunnel → `NEXT_PUBLIC_CHAT_URL`  
- [ ] Him: STT + CORS + tunnel → `NEXT_PUBLIC_STT_URL`  
- [ ] Redeploy Vercel after env changes  
- [ ] Text + voice smoke test on `*.vercel.app`  
