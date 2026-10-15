import { NextResponse } from "next/server";
import {
  normalizeChatResponse,
  type ChatResponse,
  type ThemeId,
} from "@/lib/chat";

export const runtime = "nodejs";
export const maxDuration = 60;

const themeContent: Record<
  ThemeId,
  { title: string; summary: string; pcos_context: string; overlap: string }
> = {
  cycle_irregularity: {
    title: "Menstrual cycle changes",
    summary:
      "A change in how often periods arrive can be useful to discuss with a clinician, especially if it is new for you.",
    pcos_context:
      "Irregular cycles can be associated with PCOS education, but they can also have other explanations.",
    overlap:
      "Stress, pregnancy, thyroid conditions, and other health factors may also affect cycles.",
  },
  hirsutism: {
    title: "Facial or body hair",
    summary:
      "Changes in facial or body hair can feel personal. You deserve a respectful conversation about what you have noticed.",
    pcos_context:
      "Increased hair growth can sometimes be discussed as part of PCOS education.",
    overlap:
      "Hair growth patterns vary naturally and can also relate to family traits or other hormone changes.",
  },
  acne: {
    title: "Acne",
    summary:
      "Skin changes are common and can have several contributing factors.",
    pcos_context:
      "Acne can occur alongside topics discussed in PCOS education, but acne by itself does not establish a cause.",
    overlap:
      "Skin type, stress, medicines, and other hormone changes may also play a role.",
  },
  weight_insulin: {
    title: "Weight and appetite changes",
    summary:
      "Weight and appetite are shaped by many factors. A clinician can discuss changes without judgement.",
    pcos_context:
      "Some people exploring PCOS discuss weight or appetite changes as one part of their health picture.",
    overlap:
      "Sleep, stress, medicines, and many other factors can affect appetite or weight.",
  },
  mood: {
    title: "Mood changes",
    summary:
      "Mood changes matter, whether or not they seem connected to other symptoms.",
    pcos_context:
      "Some people exploring PCOS report mood concerns; that does not show what is causing your experience.",
    overlap:
      "Life events, sleep, stress, and many health factors can influence mood.",
  },
  hair_loss: {
    title: "Hair changes",
    summary: "Hair shedding or thinning can be upsetting.",
    pcos_context:
      "Hair thinning can sometimes be considered during a PCOS-related care conversation.",
    overlap:
      "Nutrition, stress, thyroid health, family patterns, and other factors may also contribute.",
  },
  fatigue: {
    title: "Fatigue",
    summary: "Ongoing tiredness is worth discussing with a clinician.",
    pcos_context:
      "Fatigue can be reported alongside PCOS topics, but it is not specific to PCOS.",
    overlap:
      "Sleep, stress, anaemia, thyroid conditions, and many other factors can contribute.",
  },
  fertility_concerns: {
    title: "Fertility questions",
    summary:
      "Questions about getting pregnant are valid. A clinician can talk through your goals.",
    pcos_context:
      "PCOS education sometimes discusses ovulation, but experiences and care needs differ.",
    overlap:
      "Fertility involves many factors, so an individual care conversation is important.",
  },
};

function detectThemes(message: string): ThemeId[] {
  const text = message.toLowerCase();
  const matches: [ThemeId, RegExp][] = [
    ["cycle_irregularity", /period|cycle|mahine|महीने|पीरियड/],
    [
      "hirsutism",
      /facial hair|body hair|chehre.{0,12}baal|baal.{0,12}aa rahe|चेहरे.{0,8}बाल/,
    ],
    ["hair_loss", /hair fall|hair loss|thinning|झड़/],
    ["weight_insulin", /weight|वज़न|भूख|hunger|badh/],
    ["acne", /acne|pimple|मुंहासे/],
    ["mood", /mood|anxious|sad|मूड/],
    ["fatigue", /tired|fatigue|थकान/],
    ["fertility_concerns", /fertility|conceive|pregnant|गर्भधारण/],
  ];
  return matches.filter(([, pattern]) => pattern.test(text)).map(([id]) => id);
}

function isUrgent(message: string) {
  const text = message.toLowerCase();
  return (
    /heavy bleeding|soaking through pads|faint|dizzy|चक्कर|बेहोश/.test(text) &&
    /bleed|blood|pad|faint|dizzy|रक्तस्राव|खून/.test(text)
  );
}

function createFallbackResponse(message: string): ChatResponse {
  const urgent = isUrgent(message);
  const themes = urgent ? [] : detectThemes(message);
  const language =
    /[अ-ह]/.test(message) ||
    /\b(?:mahine|nahi|chehre|baal|rahe|meri|mujhe|hai|hain)\b/i.test(message)
      ? "hi"
      : "en";

  return {
    reply: urgent
      ? "You mentioned symptoms that can need urgent attention. Please seek in-person medical help now. This is not a diagnosis."
      : "Thank you for sharing. Symptoms can have different causes; this information cannot tell you what is causing yours.",
    language,
    themes: themes.map((id) => ({ id, ...themeContent[id] })),
    care: urgent
      ? {
          urgency: "urgent",
          summary:
            "Heavy bleeding with dizziness or feeling faint needs urgent medical attention now.",
          questions: [
            "When did the heavy bleeding and dizziness start?",
            "Is someone able to accompany you to urgent care?",
          ],
        }
      : {
          urgency: themes.length ? "soon" : "routine",
          summary:
            "Consider arranging a conversation with a GP or gynecologist. (Offline template — connect CHAT_API_URL for full RAG.)",
          questions: [
            "What changes should I keep track of before my visit?",
            "Could there be other explanations for these symptoms?",
          ],
        },
    sources: [],
    red_flags: urgent
      ? [
          {
            id: "heavy_bleeding_dizziness",
            label: "Heavy bleeding with dizziness or feeling faint",
            guidance: "Seek emergency or urgent care now.",
          },
        ]
      : [],
    disclaimer:
      "This is not a medical diagnosis. Sakhi provides general education and cannot replace care from a qualified health professional.",
    engine: "template",
  };
}

async function proxyToBackend(body: unknown): Promise<ChatResponse | null> {
  const target = process.env.CHAT_API_URL?.trim();
  if (!target) return null;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 55_000);
  try {
    const res = await fetch(target, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!res.ok) return null;
    const json: unknown = await res.json();
    return normalizeChatResponse(json);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 },
    );
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof (body as { message: unknown }).message !== "string"
  ) {
    return NextResponse.json(
      { error: "Message must be between 3 and 4000 characters." },
      { status: 400 },
    );
  }

  const message = (body as { message: string }).message.trim();
  if (message.length < 3 || message.length > 4000) {
    return NextResponse.json(
      { error: "Message must be between 3 and 4000 characters." },
      { status: 400 },
    );
  }

  const proxied = await proxyToBackend(body);
  if (proxied) {
    return NextResponse.json(proxied);
  }

  return NextResponse.json(createFallbackResponse(message));
}
