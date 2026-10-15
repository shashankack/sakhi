import type { RedFlag } from "./types.js";

interface Rule {
  id: string;
  patterns: RegExp[];
  label_en: string;
  label_hi: string;
  guidance_en: string;
  guidance_hi: string;
}

const RULES: Rule[] = [
  {
    id: "heavy_bleeding_dizziness",
    patterns: [
      /heavy\s+bleeding.*(dizzy|faint)/i,
      /(dizzy|faint).*(heavy\s+bleed|soaking)/i,
      /soaking\s+(through\s+)?(pad|pads)/i,
      /bahut\s+bleeding.*(chakkar|behosh)/i,
    ],
    label_en: "Heavy bleeding with dizziness or fainting",
    label_hi: "चक्कर या बेहोशी के साथ भारी रक्तस्राव",
    guidance_en:
      "Seek emergency care now. Do not wait for a routine education visit.",
    guidance_hi:
      "अभी आपातकालीन देखभाल लें। नियमित शिक्षा विज़िट का इंतज़ार न करें।",
  },
  {
    id: "severe_pelvic_pain",
    patterns: [
      /severe\s+(pelvic|abdominal|stomach)\s+pain/i,
      /pet\s+mein\s+bahut\s+tez\s+dard/i,
    ],
    label_en: "Severe pelvic or abdominal pain",
    label_hi: "तेज़ पेल्विक या पेट दर्द",
    guidance_en: "Sudden severe pain needs urgent clinical assessment now.",
    guidance_hi: "अचानक तेज़ दर्द की तुरंत चिकित्सकीय जाँच ज़रूरी है।",
  },
  {
    id: "pregnancy_concern",
    patterns: [
      /might\s+be\s+pregnant/i,
      /pregnant.*(bleed|pain)/i,
      /positive\s+pregnancy\s+test/i,
    ],
    label_en: "Possible pregnancy-related concern",
    label_hi: "संभावित गर्भावस्था संबंधी चिंता",
    guidance_en:
      "If you could be pregnant and have pain or bleeding, seek urgent obstetric or emergency care.",
    guidance_hi:
      "गर्भावस्था संभव हो और दर्द या रक्तस्राव हो तो तुरंत प्रसूति या आपातकालीन देखभाल लें।",
  },
  {
    id: "self_harm",
    patterns: [/suicid/i, /kill\s+myself/i, /want\s+to\s+die/i, /atmahatya/i],
    label_en: "Thoughts of self-harm or suicide",
    label_hi: "आत्महत्या या स्वयं को नुकसान के विचार",
    guidance_en:
      "Please reach emergency services or a crisis helpline right away.",
    guidance_hi:
      "कृपया तुरंत आपातकालीन सेवाओं या क्राइसिस हेल्पलाइन से संपर्क करें।",
  },
  {
    id: "chest_breath",
    patterns: [
      /chest\s+pain/i,
      /can'?t\s+breathe/i,
      /short(ness)?\s+of\s+breath/i,
      /saans\s+(nahi|phool)/i,
    ],
    label_en: "Chest pain or breathing difficulty",
    label_hi: "सीने में दर्द या साँस लेने में तकलीफ",
    guidance_en: "Chest pain or trouble breathing needs emergency evaluation now.",
    guidance_hi: "सीने में दर्द या साँस की तकलीफ की अभी आपातकालीन जाँच ज़रूरी है।",
  },
];

export function detectRedFlags(
  text: string,
  language: "en" | "hi",
): RedFlag[] {
  const hits: RedFlag[] = [];
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      hits.push({
        id: rule.id,
        label: language === "hi" ? rule.label_hi : rule.label_en,
        guidance: language === "hi" ? rule.guidance_hi : rule.guidance_en,
      });
    }
  }
  return hits;
}
