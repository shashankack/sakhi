# Vercel frontend + STT PC + API/RAG PC

See also: [VERCEL.md](VERCEL.md)

```text
Browser on https://….vercel.app
  → POST /api/chat  (Next.js on Vercel)  → CHAT_API_URL tunnel → your :3001 → RAG
  → POST /api/stt   (Next.js on Vercel)  → STT_API_URL tunnel  → his Whisper /transcribe
```

## Env on Vercel (server-only)

| Name | Example |
|------|---------|
| `CHAT_API_URL` | `https://xxxx.trycloudflare.com/api/chat` |
| `STT_API_URL` | `https://yyyy.trycloudflare.com` |

## Your PC

```powershell
# RAG
cd services\ml; .\.venv\Scripts\Activate.ps1
uvicorn app.main:app --host 127.0.0.1 --port 8000

# BFF
cd <repo>; npm run dev:api

# Tunnel
cloudflared tunnel --url http://127.0.0.1:3001
```

## His PC

Whisper HTTP `POST /transcribe` + CORS +  

```powershell
cloudflared tunnel --url http://127.0.0.1:9000
```

## Vercel

Root Directory: **`apps/web`**. Set env vars above → Redeploy.
