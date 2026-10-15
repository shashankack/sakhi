import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * Proxies browser audio to the teammate STT service.
 * Set STT_API_URL to the tunnel base, e.g. https://xxxx.trycloudflare.com
 * Expects STT service: POST /transcribe (multipart) → { "text": "..." }
 */
export async function POST(request: Request) {
  const base = process.env.STT_API_URL?.trim().replace(/\/$/, "");
  if (!base) {
    return NextResponse.json(
      {
        error:
          "Voice input is not configured. Set STT_API_URL to your Whisper tunnel, or type your message.",
      },
      { status: 503 },
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart audio upload." },
      { status: 400 },
    );
  }

  const audio = form.get("audio") ?? form.get("file");
  if (!(audio instanceof Blob)) {
    return NextResponse.json(
      { error: "Missing audio file field." },
      { status: 400 },
    );
  }

  const outbound = new FormData();
  outbound.append(
    "file",
    audio,
    audio instanceof File ? audio.name : "recording.webm",
  );
  outbound.append("audio", audio, "recording.webm");

  const target = `${base}/transcribe`;
  try {
    const res = await fetch(target, {
      method: "POST",
      body: outbound,
      signal: AbortSignal.timeout(55_000),
    });
    const data: unknown = await res.json().catch(() => null);
    if (!res.ok) {
      const detail =
        typeof data === "object" &&
        data !== null &&
        "error" in data &&
        typeof data.error === "string"
          ? data.error
          : `STT service error (${res.status}).`;
      return NextResponse.json({ error: detail }, { status: 502 });
    }
    const text =
      typeof data === "object" &&
      data !== null &&
      "text" in data &&
      typeof data.text === "string"
        ? data.text
        : typeof data === "object" &&
            data !== null &&
            "transcript" in data &&
            typeof data.transcript === "string"
          ? data.transcript
          : "";
    if (!text.trim()) {
      return NextResponse.json(
        { error: "STT returned empty transcript." },
        { status: 502 },
      );
    }
    return NextResponse.json({ text: text.trim() });
  } catch {
    return NextResponse.json(
      {
        error:
          "Could not reach STT tunnel. Is cloudflared running on the Whisper machine?",
      },
      { status: 502 },
    );
  }
}
