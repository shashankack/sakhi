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

export type RedFlag = {
  id: string;
  label: string;
  guidance: string;
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
  red_flags: RedFlag[];
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

/** Drop alias-map dumps so theme cards stay readable. */
export function readableProse(text: string, limit = 280): string {
  const cleaned = text.replace(/\s+/g, " ").trim();
  if (!cleaned) return "";
  const lower = cleaned.toLowerCase();
  if (
    lower.startsWith("english:") ||
    lower.includes("key demo phrases") ||
    lower.includes("hindi / hinglish") ||
    (lower.includes('"periods nahi') && lower.includes("alias"))
  ) {
    return "";
  }
  const withoutHeading = cleaned.replace(/^#+\s*/, "");
  return withoutHeading.length > limit
    ? `${withoutHeading.slice(0, limit - 1).trimEnd()}…`
    : withoutHeading;
}

export function themeCardCopy(theme: ChatResponse["themes"][number]) {
  const summary = readableProse(theme.summary);
  const context = readableProse(theme.pcos_context, 220);
  const overlap = readableProse(theme.overlap, 220);
  return {
    summary:
      summary ||
      "This theme often comes up in PCOS education conversations — it is not a diagnosis.",
    context,
    overlap,
  };
}

function normalizeRedFlags(value: unknown): RedFlag[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item, index) => {
      if (typeof item === "string") {
        return {
          id: `flag_${index}`,
          label: item,
          guidance: item,
        };
      }
      if (typeof item !== "object" || item === null) return null;
      const flag = item as Record<string, unknown>;
      const label =
        typeof flag.label === "string"
          ? flag.label
          : typeof flag.id === "string"
            ? flag.id
            : null;
      if (!label) return null;
      return {
        id: typeof flag.id === "string" ? flag.id : `flag_${index}`,
        label,
        guidance:
          typeof flag.guidance === "string" ? flag.guidance : label,
      };
    })
    .filter((flag): flag is RedFlag => flag !== null);
}

export function normalizeChatResponse(value: unknown): ChatResponse | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.reply !== "string" ||
    typeof candidate.language !== "string" ||
    typeof candidate.disclaimer !== "string" ||
    !["template", "local_llm", "hybrid"].includes(String(candidate.engine)) ||
    !Array.isArray(candidate.themes) ||
    !Array.isArray(candidate.sources) ||
    typeof candidate.care !== "object" ||
    candidate.care === null
  ) {
    return null;
  }

  const care = candidate.care as Record<string, unknown>;
  if (
    !["routine", "soon", "urgent"].includes(String(care.urgency)) ||
    typeof care.summary !== "string" ||
    !Array.isArray(care.questions) ||
    !care.questions.every((question) => typeof question === "string")
  ) {
    return null;
  }

  const themesOk = candidate.themes.every(
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
  );
  const sourcesOk = candidate.sources.every(
    (source) =>
      typeof source === "object" &&
      source !== null &&
      "title" in source &&
      typeof source.title === "string" &&
      "section" in source &&
      typeof source.section === "string",
  );
  if (!themesOk || !sourcesOk) return null;

  return {
    reply: candidate.reply,
    language: candidate.language,
    themes: candidate.themes as ChatResponse["themes"],
    care: {
      urgency: care.urgency as ChatResponse["care"]["urgency"],
      summary: care.summary,
      questions: care.questions as string[],
    },
    sources: candidate.sources as ChatResponse["sources"],
    red_flags: normalizeRedFlags(candidate.red_flags),
    disclaimer: candidate.disclaimer,
    engine: candidate.engine as ChatResponse["engine"],
  };
}

/** @deprecated use normalizeChatResponse */
export function isChatResponse(value: unknown): value is ChatResponse {
  return normalizeChatResponse(value) !== null;
}
