export type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
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
  { id: "en", label: "English", bcp47: "en-IN" },
  { id: "hi", label: "Hindi", bcp47: "hi-IN" },
  { id: "kn", label: "ಕನ್ನಡ", bcp47: "kn-IN" },
];

export function voiceBcp47(id: VoiceLocale): string {
  return VOICE_LANG_OPTIONS.find((o) => o.id === id)?.bcp47 ?? "en-IN";
}
