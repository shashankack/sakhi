# Deploy Saheli frontend on Vercel

Only the Next.js app in `apps/web` is deployed. Chat/STT backends stay on laptops via tunnels.

## Project settings (Vercel dashboard)

| Setting | Value |
|---------|--------|
| Framework Preset | **Next.js** |
| Root Directory | **`apps/web`** |
| Build Command | `npm run build` (default) |
| Install Command | `npm install` (default) |
| Output | default Next.js |
| Node.js Version | **20.x** or **22.x** |

> Prefer setting **Root Directory = `apps/web`** in the Vercel UI.  
> If you leave root at repo root, use the repo `vercel.json` instead.

## Environment variables

Add under **Settings → Environment Variables** for **Production** (and Preview if you want):

| Name | Required | Example | Notes |
|------|----------|---------|--------|
| `CHAT_API_URL` | **Yes** for live RAG | `https://xxxx.trycloudflare.com/api/chat` | Server-only. Your laptop BFF tunnel. |
| `STT_API_URL` | No (voice) | `https://yyyy.trycloudflare.com` | Server-only. Whisper tunnel **base** URL (no `/transcribe`). |

Do **not** put secrets in `NEXT_PUBLIC_*` for these — the browser calls same-origin `/api/chat` and `/api/stt`, which proxy server-side.

After changing env vars: **Deployments → … → Redeploy**.

## Local UI against your API

```powershell
cd apps/web
copy .env.example .env.local
# edit CHAT_API_URL=http://127.0.0.1:3001/api/chat
npm install
npm run dev
```

Open http://localhost:3000/chat

## Demo day

1. Your PC: RAG `:8000` + BFF `:3001` + `cloudflared tunnel --url http://127.0.0.1:3001`  
2. Copy tunnel URL → set `CHAT_API_URL=https://…/api/chat` on Vercel → Redeploy  
3. (Optional) His PC: Whisper + cloudflared → set `STT_API_URL` → Redeploy  
4. Open the `*.vercel.app` URL  

If tunnels restart, URLs change — update Vercel env and redeploy (or use named Cloudflare tunnels).

## Without tunnels

Leave `CHAT_API_URL` unset → UI uses built-in **template fallback** (still demoable, weaker than RAG).
