# Teammate Ollama (Mac) → our RAG polish

His **Ollama API** listens on **`127.0.0.1:11434`**.  
Ports like `62903` / `62641` are internal `llama-server` children  **do not tunnel those**.

## On his Mac

Ollama rejects Cloudflare’s Host/Origin by default → **403** through the tunnel.
Must set `OLLAMA_ORIGINS=*`.

**Both steps required.** Restarting only cloudflared still returns HTTP 403.

Terminal A  fully quit Ollama (menu bar → Quit), then:
```bash
killall Ollama 2>/dev/null; killall ollama 2>/dev/null
export OLLAMA_ORIGINS="*"
export OLLAMA_HOST="127.0.0.1:11434"
ollama serve
```

Confirm local still works:
```bash
curl -s http://127.0.0.1:11434/api/tags | head -c 200
```

Terminal B  **must rewrite Host** or Ollama returns 403 (DNS-rebinding guard):
```bash
cloudflared tunnel --protocol http2 --http-host-header "127.0.0.1:11434" --url http://127.0.0.1:11434
```

Send us the printed `https://….trycloudflare.com` URL.

Local check:
```bash
curl -s http://127.0.0.1:11434/api/tags
```

Tunnel check (from our PC):
```powershell
curl.exe -s https://HIS.trycloudflare.com/api/tags
```
Must return JSON models, not HTTP 403.

## On our Windows PC (RAG)

Restart RAG with:

```powershell
cd C:\crucifer\Hackathons\chaos\services\ml
.\.venv\Scripts\Activate.ps1
$env:OLLAMA_ENABLED="1"
# Current (15 Oct 2026): miniature-quarter-circuit-obviously
$env:OLLAMA_URL="https://miniature-quarter-circuit-obviously.trycloudflare.com/api/generate"
$env:OLLAMA_MODEL="llama3.2"
uvicorn app.main:app --host 127.0.0.1 --port 8001
```

Chat still goes: Vercel → our BFF tunnel → RAG `:8001` → (optional) his Ollama polish.

Frontend: https://sakhi-seven-sigma.vercel.app/chat  
Needs `CHAT_API_URL` = our BFF cloudflared `…/api/chat` (already working if chat replies).
