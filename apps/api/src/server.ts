import cors from "cors";
import express from "express";
import { buildFallback } from "./fallback.js";
import type { ChatRequest, ChatResponse } from "./types.js";

const PORT = Number(process.env.API_PORT || 3001);
// RAG lives on :8001 so a teammate model can keep :8000
const ML_URL = process.env.ML_ANALYZE_URL || "http://127.0.0.1:8001/analyze";
const ML_TIMEOUT_MS = Number(process.env.ML_TIMEOUT_MS || 8000);

const app = express();
app.use(cors({ origin: true }));
app.use(express.json({ limit: "64kb" }));

function validateRequest(body: unknown): { ok: true; data: ChatRequest } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Request body must be JSON." };
  }
  const b = body as Record<string, unknown>;
  const message = typeof b.message === "string" ? b.message.trim() : "";
  if (message.length < 3) {
    return { ok: false, error: "Please describe your symptoms in a few words." };
  }
  if (message.length > 4000) {
    return { ok: false, error: "Please keep your description under 4000 characters." };
  }
  const locale =
    b.locale === "en" ||
    b.locale === "hi" ||
    b.locale === "kn" ||
    b.locale === "auto"
      ? b.locale
      : "auto";
  const history = Array.isArray(b.history) ? b.history : undefined;
  return {
    ok: true,
    data: { message, history: history as ChatRequest["history"], locale },
  };
}

async function callMl(req: ChatRequest): Promise<ChatResponse | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ML_TIMEOUT_MS);
  try {
    const res = await fetch(ML_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as ChatResponse;
    if (!data || typeof data.reply !== "string" || !data.care || !data.disclaimer) {
      return null;
    }
    return data;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "sakhi-api", ml_url: ML_URL });
});

app.post("/api/chat", async (req, res) => {
  const parsed = validateRequest(req.body);
  if (!parsed.ok) {
    res.status(400).json({ error: parsed.error });
    return;
  }

  const ml = await callMl(parsed.data);
  if (ml) {
    res.json(ml);
    return;
  }

  res.json(buildFallback(parsed.data));
});

app.listen(PORT, () => {
  console.log(`[sakhi-api] listening on http://127.0.0.1:${PORT}`);
  console.log(`[sakhi-api] ML proxy → ${ML_URL}`);
});
