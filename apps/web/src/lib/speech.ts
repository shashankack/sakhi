export type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives?: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
};

export type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: ArrayLike<{
    isFinal: boolean;
    0: { transcript: string };
  }>;
};

type SpeechWindow = Window & {
  SpeechRecognition?: new () => SpeechRecognitionLike;
  webkitSpeechRecognition?: new () => SpeechRecognitionLike;
};

export function getSpeechRecognitionCtor():
  | (new () => SpeechRecognitionLike)
  | null {
  if (typeof window === "undefined") return null;
  const w = window as SpeechWindow;
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

export function speechSupported(): boolean {
  return getSpeechRecognitionCtor() !== null;
}

export type VoiceLocale = "en" | "hi" | "kn";

export const VOICE_LANG_OPTIONS: {
  id: VoiceLocale;
  label: string;
  bcp47: string;
}[] = [
  // en-US: Chrome's en-IN often emits Devanagari when the OS/browser is Hindi.
  { id: "en", label: "English", bcp47: "en-US" },
  { id: "hi", label: "Hindi", bcp47: "hi-IN" },
  { id: "kn", label: "ಕನ್ನಡ", bcp47: "kn-IN" },
];

// Bump key when defaults change so a prior "hi" (from demos) does not stick.
const VOICE_LOCALE_KEY = "Aai.voiceLocale.v2";

export function voiceBcp47(id: VoiceLocale): string {
  return VOICE_LANG_OPTIONS.find((o) => o.id === id)?.bcp47 ?? "en-US";
}

export function readStoredVoiceLocale(): VoiceLocale {
  if (typeof window === "undefined") return "en";
  try {
    const raw = window.localStorage.getItem(VOICE_LOCALE_KEY);
    if (raw === "en" || raw === "hi" || raw === "kn") return raw;
  } catch {
    /* ignore */
  }
  return "en";
}

export function storeVoiceLocale(id: VoiceLocale): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VOICE_LOCALE_KEY, id);
  } catch {
    /* ignore */
  }
}

const DEVANAGARI = /[\u0900-\u097F]/;
const KANNADA = /[\u0C80-\u0CFF]/;

/** True when transcript script clearly disagrees with the selected mic language. */
export function transcriptMismatchesLocale(
  transcript: string,
  locale: VoiceLocale,
): boolean {
  const text = transcript.trim();
  if (!text) return false;
  if (locale === "en") return DEVANAGARI.test(text) || KANNADA.test(text);
  if (locale === "hi") return KANNADA.test(text);
  if (locale === "kn") return DEVANAGARI.test(text);
  return false;
}
