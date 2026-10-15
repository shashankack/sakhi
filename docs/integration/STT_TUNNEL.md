# Voice input (browser)

Whisper / `STT_API_URL` is **not** required.

Chat uses the **browser Speech Recognition API** (Chrome / Edge):

1. Choose **Speak in**: English / Hindi / ಕನ್ನಡ (sets `recognition.lang` to `en-IN` / `hi-IN` / `kn-IN`)
2. Tap the mic next to Send
3. Speak in the selected language
4. Tap stop, edit if needed, Send

Default is **English** (`en-IN`). If the mic is left on Hindi while you speak English, Chrome may type Devanagari — switch the chip first.

Safari/Firefox may not support it — typing still works.

Stack otherwise unchanged: Vercel → BFF tunnel → RAG `:8001` → optional Ollama polish.
