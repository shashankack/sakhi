# Voice input (browser)

Whisper / `STT_API_URL` is **not** required.

Chat uses the **browser Speech Recognition API** (Chrome / Edge):

1. Tap the mic next to Send
2. Speak Hindi / Hinglish / English
3. Tap stop, edit if needed, Send

Safari/Firefox may not support it — typing still works.

Stack otherwise unchanged: Vercel → BFF tunnel → RAG `:8001` → optional Ollama polish.
