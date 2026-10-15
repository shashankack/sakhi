# STT layer — dropped

Voice / Whisper / `STT_API_URL` are **out of scope** for this hackathon build.

Stack is chat-only:

- RAG: `services/ml` on `:8001` (`:8000` free for teammate model)
- BFF: `apps/api` on `:3001`
- Frontend: Vercel → `CHAT_API_URL` → cloudflared → `:3001`

See [VERCEL.md](./VERCEL.md).
