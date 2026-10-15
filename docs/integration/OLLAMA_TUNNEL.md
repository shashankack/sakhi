# Teammate Ollama (Mac) → our RAG polish

His **Ollama API** listens on **`127.0.0.1:11434`**.  
Ports like `62903` / `62641` are internal `llama-server` children — **do not tunnel those**.

## On his Mac

Terminal A (keep running):
```bash
ollama serve
# model already loaded: llama3.2
```

Terminal B:
```bash
cloudflared tunnel --url http://127.0.0.1:11434
```

Send us the printed `https://….trycloudflare.com` URL.

Local check:
```bash
curl -s http://127.0.0.1:11434/api/tags
```

## On our Windows PC (RAG)

Restart RAG with:

```powershell
cd C:\crucifer\Hackathons\chaos\services\ml
.\.venv\Scripts\Activate.ps1
$env:OLLAMA_ENABLED="1"
$env:OLLAMA_URL="https://HIS-TUNNEL.trycloudflare.com/api/generate"
$env:OLLAMA_MODEL="llama3.2"
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Chat still goes: Vercel → our BFF tunnel → RAG `:8001` → (optional) his Ollama polish.

Frontend: https://sakhi-seven-sigma.vercel.app/chat  
Needs `CHAT_API_URL` = our BFF cloudflared `…/api/chat` (already working if chat replies).
