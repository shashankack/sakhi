export type ThemeId =
  | "cycle_irregularity"
  | "hirsutism"
  | "acne"
  | "weight_insulin"
  | "mood"
  | "hair_loss"
  | "fatigue"
  | "fertility_concerns";

export type ChatRequest = {
  message: string;
  history?: { role: "user" | "assistant"; content: string }[];
  locale?: "auto" | "en" | "hi";
};

export type ChatResponse = {
  reply: string;
  language: string;
  themes: {
    id: ThemeId;
    title: string;
    summary: string;
    pcos_context: string;
    overlap: string;
  }[];
  care: {
    urgency: "routine" | "soon" | "urgent";
    summary: string;
    questions: string[];
  };
  sources: { title: string; section: string }[];
  red_flags: string[];
  disclaimer: string;
  engine: "template" | "local_llm" | "hybrid";
};

const themeIds: ThemeId[] = [
  "cycle_irregularity",
  "hirsutism",
  "acne",
  "weight_insulin",
  "mood",
  "hair_loss",
  "fatigue",
  "fertility_concerns",
];

export const themeOptions: { id: ThemeId; label: string; hindi: string }[] = [
  { id: "cycle_irregularity", label: "Irregular periods", hindi: "अनियमित पीरियड्स" },
  { id: "hirsutism", label: "Facial / body hair", hindi: "चेहरे / शरीर पर बाल" },
  { id: "acne", label: "Acne", hindi: "मुंहासे" },
  { id: "weight_insulin", label: "Weight / hunger", hindi: "वज़न / भूख" },
  { id: "mood", label: "Mood changes", hindi: "मूड में बदलाव" },
  { id: "hair_loss", label: "Hair fall", hindi: "बाल झड़ना" },
  { id: "fatigue", label: "Fatigue", hindi: "थकान" },
  { id: "fertility_concerns", label: "Trying to conceive", hindi: "गर्भधारण की चिंता" },
];

export function getThemeLabel(id: ThemeId) {
  return themeOptions.find((theme) => theme.id === id)?.label ?? id;
}

export function isChatResponse(value: unknown): value is ChatResponse {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.reply !== "string" ||
    typeof candidate.language !== "string" ||
    typeof candidate.disclaimer !== "string" ||
    !["template", "local_llm", "hybrid"].includes(String(candidate.engine)) ||
    !Array.isArray(candidate.themes) ||
    !Array.isArray(candidate.sources) ||
    !Array.isArray(candidate.red_flags) ||
    typeof candidate.care !== "object" ||
    candidate.care === null
  ) {
    return false;
  }

  const care = candidate.care as Record<string, unknown>;
  return (
    ["routine", "soon", "urgent"].includes(String(care.urgency)) &&
    typeof care.summary === "string" &&
    Array.isArray(care.questions) &&
    care.questions.every((question) => typeof question === "string") &&
    candidate.red_flags.every((flag) => typeof flag === "string") &&
    candidate.sources.every(
      (source) =>
        typeof source === "object" &&
        source !== null &&
        "title" in source &&
        typeof source.title === "string" &&
        "section" in source &&
        typeof source.section === "string",
    ) &&
    candidate.themes.every(
      (theme) =>
        typeof theme === "object" &&
        theme !== null &&
        "id" in theme &&
        typeof theme.id === "string" &&
        themeIds.includes(theme.id as ThemeId) &&
        "title" in theme &&
        typeof theme.title === "string" &&
        "summary" in theme &&
        typeof theme.summary === "string" &&
        "pcos_context" in theme &&
        typeof theme.pcos_context === "string" &&
        "overlap" in theme &&
        typeof theme.overlap === "string",
    )
  );
}
