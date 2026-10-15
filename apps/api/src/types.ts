export type Locale = "auto" | "en" | "hi";
export type Urgency = "routine" | "soon" | "urgent";
export type Engine = "template" | "local_llm" | "hybrid";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  history?: ChatMessage[];
  locale?: Locale;
}

export interface ThemeCard {
  id: string;
  title: string;
  summary: string;
  pcos_context: string;
  overlap: string;
}

export interface CareBlock {
  urgency: Urgency;
  summary: string;
  questions: string[];
}

export interface SourceRef {
  title: string;
  section: string;
}

export interface RedFlag {
  id: string;
  label: string;
  guidance: string;
}

export interface ChatResponse {
  reply: string;
  language: "en" | "hi";
  themes: ThemeCard[];
  care: CareBlock;
  sources: SourceRef[];
  red_flags: RedFlag[];
  disclaimer: string;
  engine: Engine;
}
