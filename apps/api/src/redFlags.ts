import type { Language, RedFlag } from "./types.js";

interface Rule {
  id: string;
  patterns: RegExp[];
  label_en: string;
  label_hi: string;
  label_kn: string;
  guidance_en: string;
  guidance_hi: string;
  guidance_kn: string;
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
    label_kn: "ತಲೆಸುತ್ತು ಅಥವಾ ಮೂರ್ಛೆಯೊಂದಿಗೆ ಅತಿಯಾದ ರಕ್ತಸ್ರಾವ",
    guidance_en:
      "Seek emergency care now. Do not wait for a routine education visit.",
    guidance_hi:
      "अभी आपातकालीन देखभाल लें। नियमित शिक्षा विज़िट का इंतज़ार न करें।",
    guidance_kn: "ಈಗಲೇ ತುರ್ತು ಆರೈಕೆ ಪಡೆಯಿರಿ. ಸಾಮಾನ್ಯ ಭೇಟಿಗಾಗಿ ಕಾಯಬೇಡಿ.",
  },
  {
    id: "severe_pelvic_pain",
    patterns: [
      /severe\s+(pelvic|abdominal|stomach)\s+pain/i,
      /pet\s+mein\s+bahut\s+tez\s+dard/i,
    ],
    label_en: "Severe pelvic or abdominal pain",
    label_hi: "तेज़ पेल्विक या पेट दर्द",
    label_kn: "ತೀವ್ರ ಪೆಲ್ವಿಕ್ ಅಥವಾ ಹೊಟ್ಟೆ ನೋವು",
    guidance_en: "Sudden severe pain needs urgent clinical assessment now.",
    guidance_hi: "अचानक तेज़ दर्द की तुरंत चिकित्सकीय जाँच ज़रूरी है।",
    guidance_kn: "ಹಠಾತ್ ತೀವ್ರ ನೋವಿಗೆ ಈಗಲೇ ವೈದ್ಯಕೀಯ ಪರೀಕ್ಷೆ ಬೇಕು.",
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
    label_kn: "ಗರ್ಭಧಾರಣೆ ಸಂಬಂಧಿತ ಸಂಭಾವ್ಯ ಕಾಳಜಿ",
    guidance_en:
      "If you could be pregnant and have pain or bleeding, seek urgent obstetric or emergency care.",
    guidance_hi:
      "गर्भावस्था संभव हो और दर्द या रक्तस्राव हो तो तुरंत प्रसूति या आपातकालीन देखभाल लें।",
    guidance_kn:
      "ಗರ್ಭಿಣಿಯಾಗಿರಬಹುದು ಮತ್ತು ನೋವು/ರಕ್ತಸ್ರಾವವಿದ್ದರೆ ತುರ್ತು ಪ್ರಸೂತಿ ಅಥವಾ ತುರ್ತು ಆರೈಕೆ ಪಡೆಯಿರಿ.",
  },
  {
    id: "self_harm",
    patterns: [/suicid/i, /kill\s+myself/i, /want\s+to\s+die/i, /atmahatya/i],
    label_en: "Thoughts of self-harm or suicide",
    label_hi: "आत्महत्या या स्वयं को नुकसान के विचार",
    label_kn: "ಆತ್ಮಹತ್ಯೆ ಅಥವಾ ಸ್ವಯಂ ಹಾನಿಯ ಆಲೋಚನೆಗಳು",
    guidance_en:
      "Please reach emergency services or a crisis helpline right away.",
    guidance_hi:
      "कृपया तुरंत आपातकालीन सेवाओं या क्राइसिस हेल्पलाइन से संपर्क करें।",
    guidance_kn:
      "ದಯವಿಟ್ಟು ತಕ್ಷಣ ತುರ್ತು ಸೇವೆಗಳು ಅಥವಾ ಸಂಕಷ್ಟ ಹೆಲ್ಪ್‌ಲೈನ್ ಸಂಪರ್ಕಿಸಿ.",
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
    label_kn: "ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆ",
    guidance_en: "Chest pain or trouble breathing needs emergency evaluation now.",
    guidance_hi: "सीने में दर्द या साँस की तकलीफ की अभी आपातकालीन जाँच ज़रूरी है।",
    guidance_kn: "ಎದೆ ನೋವು ಅಥವಾ ಉಸಿರಾಟದ ತೊಂದರೆಗೆ ಈಗಲೇ ತುರ್ತು ಪರೀಕ್ಷೆ ಬೇಕು.",
  },
];

function localized(rule: Rule, language: Language, field: "label" | "guidance") {
  if (language === "hi") return rule[`${field}_hi`];
  if (language === "kn") return rule[`${field}_kn`];
  return rule[`${field}_en`];
}

export function detectRedFlags(text: string, language: Language): RedFlag[] {
  const hits: RedFlag[] = [];
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(text))) {
      hits.push({
        id: rule.id,
        label: localized(rule, language, "label"),
        guidance: localized(rule, language, "guidance"),
      });
    }
  }
  return hits;
}
