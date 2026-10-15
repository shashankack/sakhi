# services/ml/stt

**Owner:** STT teammate (`ml` branch)

Speech → text on **this** machine, then send text to Integration’s  
`POST /api/chat` (LAN or tunnel). Do **not** edit `services/ml/app/` (RAG).

## Full guide

See **[docs/integration/STT_TUNNEL.md](../../../docs/integration/STT_TUNNEL.md)** for both machines.

## Quick test

```powershell
$env:SAKHI_CHAT_URL = "http://<INTEGRATION_IP_OR_TUNNEL>/api/chat"
python send_to_sakhi.py "periods 2 mahine se nahi aaye, chehre pe baal"
```
