import { NextResponse } from "next/server";
import type { ChatResponse, ThemeId } from "@/lib/chat";

const themeContent: Record<
  ThemeId,
  { title: string; summary: string; pcos_context: string; overlap: string }
> = {
  cycle_irregularity: {
    title: "Menstrual cycle changes",
    summary:
      "A change in how often periods arrive can be useful to discuss with a clinician, especially if it is new for you.",
    pcos_context:
      "Irregular cycles can be associated with PCOS, but they can also have other explanations.",
    overlap:
      "Stress, pregnancy, thyroid conditions, and other health factors may also affect cycles.",
  },
  hirsutism: {
    title: "Facial or body hair",
    summary:
      "Changes in facial or body hair can feel personal. You deserve a respectful conversation about what you have noticed.",
    pcos_context:
      "Increased hair growth can sometimes be discussed as part of PCOS assessment.",
    overlap:
      "Hair growth patterns vary naturally and can also relate to family traits or other hormone changes.",
  },
  acne: {
    title: "Acne",
    summary:
      "Skin changes are common and can have several contributing factors. It may help to describe when the changes began.",
    pcos_context:
      "Acne can occur alongside PCOS for some people, but acne by itself does not establish a cause.",
    overlap:
      "Skin type, stress, medicines, and other hormone changes may also play a role.",
  },
  weight_insulin: {
    title: "Weight and appetite changes",
    summary:
      "Weight and appetite are shaped by many factors. A compassionate clinician can discuss changes without judgement.",
    pcos_context:
      "Some people with PCOS discuss weight or appetite changes as one part of their overall health picture.",
    overlap:
      "Sleep, stress, medicines, and many other health and life factors can affect appetite or weight.",
  },
  mood: {
    title: "Mood changes",
    summary:
      "Mood changes matter, whether or not they seem connected to other symptoms. Consider sharing how they affect daily life.",
    pcos_context:
      "Some people with PCOS report mood concerns, though that does not show what is causing your experience.",
    overlap:
      "Life events, sleep, stress, and many health factors can influence mood.",
  },
  hair_loss: {
    title: "Hair changes",
    summary:
      "Hair shedding or thinning can be upsetting. Noting when it started and any other changes may help a care conversation.",
    pcos_context:
      "Hair thinning can sometimes be considered during a PCOS assessment.",
    overlap:
      "Nutrition, stress, thyroid health, family patterns, and other factors may also contribute.",
  },
  fatigue: {
    title: "Fatigue",
    summary:
      "Ongoing tiredness is worth discussing, especially when it affects your routine or is different from your usual energy.",
    pcos_context:
      "Fatigue can be reported by people with PCOS, but it is not specific to PCOS.",
    overlap:
      "Sleep, stress, anaemia, thyroid conditions, and many other factors can contribute.",
  },
  fertility_concerns: {
    title: "Fertility questions",
    summary:
      "Questions about getting pregnant are valid. A clinician can talk through your goals and individual circumstances.",
    pcos_context:
      "PCOS can affect ovulation for some people, but experiences and care needs differ.",
    overlap:
      "Fertility involves many factors for all people, so an individual care conversation is important.",
  },
};

function detectThemes(message: string): ThemeId[] {
  const text = message.toLowerCase();
  const matches: [ThemeId, RegExp][] = [
    ["cycle_irregularity", /period|cycle|mahine|महीने|पीरियड/],
    ["hirsutism", /facial hair|body hair|chehre.{0,12}baal|baal.{0,12}aa rahe|चेहरे.{0,8}बाल|शरीर पर बाल/],
    ["hair_loss", /hair fall|hair loss|thinning|झड़/],
    ["weight_insulin", /weight|वज़न|भूख|hunger/],
    ["acne", /acne|pimple|मुंहासे/],
    ["mood", /mood|anxious|sad|मूड/],
    ["fatigue", /tired|fatigue|थकान/],
    ["fertility_concerns", /fertility|conceive|pregnant|गर्भधारण/],
  ];
  const found = matches
    .filter(([, pattern]) => pattern.test(text))
    .map(([id]) => id);
  return found.length > 0 ? found : ["cycle_irregularity"];
}

function isUrgent(message: string) {
  const text = message.toLowerCase();
  return (
    /heavy bleeding|soaking through pads|soak.{0,20}pad|faint|about to faint|dizzy|चक्कर|बेहोश/.test(
      text,
    ) && /bleed|blood|pad|faint|dizzy|रक्तस्राव|खून/.test(text)
  );
}

function createResponse(message: string): ChatResponse {
  const urgent = isUrgent(message);
  const themes = urgent ? [] : detectThemes(message);
  const language =
    /[अ-ह]/u.test(message) || /\b(?:mahine|nahi|chehre|baal|rahe|meri|mujhe|hai|hain)\b/i.test(message)
      ? "hi"
      : "en";
  const response: ChatResponse = {
    reply: urgent
      ? "You mentioned heavy bleeding and feeling dizzy or close to fainting. Those symptoms can need urgent attention. Please seek in-person medical help now."
      : "Thank you for sharing what you have noticed. Symptoms can have different causes, and this information cannot tell you what is causing yours.",
    language,
    themes: themes.map((id) => ({ id, ...themeContent[id] })),
    care: urgent
      ? {
          urgency: "urgent",
          summary:
            "Heavy bleeding together with dizziness or feeling faint needs urgent medical attention now. Contact your local emergency service or go to urgent/emergency care. Do not wait for an online response.",
          questions: [
            "When did the heavy bleeding and dizziness start?",
            "Is someone able to accompany you to urgent care?",
          ],
        }
      : {
          urgency: "soon",
          summary:
            "Consider arranging a conversation with a GP or gynecologist, especially if these changes are new, persistent, or concerning to you.",
          questions: [
            "What changes should I keep track of before my visit?",
            "Could there be other explanations for these symptoms?",
          ],
        },
    sources: [],
    red_flags: urgent
      ? ["Heavy bleeding with dizziness or feeling faint"]
      : [],
    disclaimer:
      "This is not a medical diagnosis. Saheli provides general education and cannot replace care from a qualified health professional.",
    engine: "template",
  };
  return response;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("message" in body) ||
    typeof body.message !== "string" ||
    body.message.trim().length < 3 ||
    body.message.length > 4000
  ) {
    return NextResponse.json(
      { error: "Message must be between 3 and 4000 characters." },
      { status: 400 },
    );
  }

  if (
    "locale" in body &&
    body.locale !== undefined &&
    !["auto", "en", "hi"].includes(String(body.locale))
  ) {
    return NextResponse.json(
      { error: "Locale must be auto, en, or hi." },
      { status: 400 },
    );
  }

  if (
    "history" in body &&
    body.history !== undefined &&
    (!Array.isArray(body.history) ||
      body.history.some(
        (turn) =>
          typeof turn !== "object" ||
          turn === null ||
          !("role" in turn) ||
          !["user", "assistant"].includes(String(turn.role)) ||
          !("content" in turn) ||
          typeof turn.content !== "string",
      ))
  ) {
    return NextResponse.json(
      { error: "History must contain user or assistant messages." },
      { status: 400 },
    );
  }

  return NextResponse.json(createResponse(body.message));
}
