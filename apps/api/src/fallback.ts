import { DISCLAIMER_EN, DISCLAIMER_HI, DISCLAIMER_KN } from "./disclaimer.js";
import { detectLanguage } from "./language.js";
import { detectRedFlags } from "./redFlags.js";
import type { ChatRequest, ChatResponse, Language, ThemeCard } from "./types.js";

const THEME_HINTS: {
  id: string;
  title_en: string;
  title_hi: string;
  keywords: RegExp[];
  summary_en: string;
  summary_hi: string;
  pcos_en: string;
  pcos_hi: string;
  overlap_en: string;
  overlap_hi: string;
}[] = [
  {
    id: "cycle_irregularity",
    title_en: "Menstrual cycle changes",
    title_hi: "मासिक धर्म चक्र में बदलाव",
    keywords: [
      /period/i,
      /cycle/i,
      /mahine/i,
      /महीन/i,
      /पीरियड/i,
      /अनियमित/i,
    ],
    summary_en:
      "Late, skipped, or unpredictable periods are a common reason people seek answers. Many factors can shift timing.",
    summary_hi:
      "देर से आना, छूटना या अनिश्चित पीरियड्स आम चिंता है। कई कारण समय बदल सकते हैं।",
    pcos_en:
      "In PCOS education, irregular cycles are often discussed alongside ovulation patterns  this is not a diagnosis.",
    pcos_hi:
      "PCOS शिक्षा में अनियमित चक्रों की चर्चा ओव्यूलेशन पैटर्न के साथ होती है  यह निदान नहीं है।",
    overlap_en: "Thyroid issues, stress, pregnancy, and medicines can also change cycles.",
    overlap_hi: "थायरॉइड, तनाव, गर्भावस्था और दवाएँ भी चक्र बदल सकती हैं।",
  },
  {
    id: "hirsutism",
    title_en: "Unwanted facial or body hair",
    title_hi: "अवांछित चेहरे / शरीर के बाल",
    keywords: [/facial\s+hair/i, /baal/i, /hirsut/i, /चेहरे पर बाल/i, /chin\s+hair/i],
    summary_en:
      "New or thicker facial/body hair can feel distressing and has several possible explanations.",
    summary_hi:
      "नए या मोटे चेहरे/शरीर के बाल परेशान कर सकते हैं और कई कारण हो सकते हैं।",
    pcos_en:
      "PCOS education sometimes mentions androgen-related hair patterns. Appearance alone cannot confirm PCOS.",
    pcos_hi:
      "PCOS शिक्षा में कभी-कभी एंड्रोजन से जुड़े बाल पैटर्न का ज़िक्र होता है। केवल दिखावट से पुष्टि नहीं होती।",
    overlap_en: "Genetics and some medicines can also increase hair growth.",
    overlap_hi: "जेनेटिक्स और कुछ दवाएँ भी बाल बढ़ा सकती हैं।",
  },
  {
    id: "weight_insulin",
    title_en: "Weight and appetite changes",
    title_hi: "वज़न और भूख में बदलाव",
    keywords: [/weight/i, /vazan|vajan/i, /badh/i, /insulin/i, /वज़न/i],
    summary_en:
      "Hunger or weight changes can relate to sleep, stress, medicines, thyroid, or how the body handles glucose.",
    summary_hi:
      "भूख या वज़न बदलाव नींद, तनाव, दवाएँ, थायरॉइड या ग्लूकोज़ हैंडलिंग से जुड़ सकते हैं।",
    pcos_en:
      "Some PCOS education notes insulin resistance can make weight feel harder to manage  not a diagnosis by itself.",
    pcos_hi:
      "कुछ PCOS शिक्षा में इंसुलिन प्रतिरोध का ज़िक्र है  स्वयं निदान नहीं।",
    overlap_en: "Thyroid disease and lifestyle factors are common other explanations.",
    overlap_hi: "थायरॉइड और जीवनशैली अन्य आम कारण हैं।",
  },
  {
    id: "acne",
    title_en: "Acne that is hard to clear",
    title_hi: "मुंहासे",
    keywords: [/acne/i, /pimple/i, /munhase|muhase/i, /मुंहासे/i],
    summary_en: "Persistent jawline or adult acne has many causes, including hormones and skincare factors.",
    summary_hi: "लगातार जबड़े या वयस्क मुंहासों के कई कारण हो सकते हैं।",
    pcos_en: "Acne is sometimes discussed with PCOS education when clustered with cycle or hair changes.",
    pcos_hi: "मुंहासे PCOS शिक्षा में तब चर्चा होते हैं जब चक्र या बाल बदलाव के साथ हों।",
    overlap_en: "Cosmetics, stress, and other hormones can drive acne without PCOS.",
    overlap_hi: "कॉस्मेटिक्स, तनाव और अन्य हार्मोन भी मुंहासे ला सकते हैं।",
  },
  {
    id: "fatigue",
    title_en: "Ongoing tiredness",
    title_hi: "लगातार थकान",
    keywords: [/fatigue/i, /tired/i, /thakaan|thakawat/i, /थकान/i],
    summary_en: "Persistent tiredness is a signal to check sleep, mood, iron, thyroid, and overall health.",
    summary_hi: "लगातार थकान नींद, मूड, आयरन, थायरॉइड जाँचने का संकेत है।",
    pcos_en: "Fatigue alone does not point to PCOS; it may appear alongside other concerns.",
    pcos_hi: "अकेली थकान PCOS नहीं बताती।",
    overlap_en: "Anemia, thyroid disease, and depression are common alternatives.",
    overlap_hi: "एनीमिया, थायरॉइड और अवसाद आम विकल्प हैं।",
  },
];

function pickThemes(text: string, language: Language): ThemeCard[] {
  // Fallback theme cards: Hindi when requested; English otherwise (incl. Kannada).
  const hi = language === "hi";
  const matched: ThemeCard[] = [];
  for (const hint of THEME_HINTS) {
    if (hint.keywords.some((k) => k.test(text))) {
      matched.push({
        id: hint.id,
        title: hi ? hint.title_hi : hint.title_en,
        summary: hi ? hint.summary_hi : hint.summary_en,
        pcos_context: hi ? hint.pcos_hi : hint.pcos_en,
        overlap: hi ? hint.overlap_hi : hint.overlap_en,
      });
    }
    if (matched.length >= 3) break;
  }
  return matched;
}

/** Safe Integration fallback when ML service is unreachable. */
export function buildFallback(req: ChatRequest): ChatResponse {
  const language =
    req.locale === "en" || req.locale === "hi" || req.locale === "kn"
      ? req.locale
      : detectLanguage(req.message);

  const red_flags = detectRedFlags(req.message, language);
  const themes = red_flags.length > 0 ? [] : pickThemes(req.message, language);
  const snippet = req.message.trim().slice(0, 100);
  const ellipsis = req.message.length > 100 ? "…" : "";

  let reply: string;
  if (language === "hi") {
    reply = `आपने बताया: “${snippet}${ellipsis}”. यह शैक्षिक जानकारी है, निदान नहीं। ${
      red_flags.length
        ? "पहले तात्कालिक मार्गदर्शन देखें।"
        : themes.length
          ? "नीचे संबंधित शिक्षा विषय हैं।"
          : "कृपया चिकित्सक से बात करें।"
    } ML सेवा अभी उपलब्ध नहीं थी, इसलिए सुरक्षित फ़ॉलबैक चल रहा है।`;
  } else if (language === "kn") {
    reply = `ನೀವು ಹೇಳಿದ್ದು: “${snippet}${ellipsis}”. ಇದು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ, ರೋಗನಿರ್ಣಯವಲ್ಲ. ${
      red_flags.length
        ? "ಮೊದಲು ತುರ್ತು ಮಾರ್ಗದರ್ಶನವನ್ನು ನೋಡಿ."
        : themes.length
          ? "ಕೆಳಗೆ ಸಂಬಂಧಿತ ಶಿಕ್ಷಣ ವಿಷಯಗಳಿವೆ."
          : "ದಯವಿಟ್ಟು ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ."
    } ML ಸೇವೆ ಲಭ್ಯವಿರಲಿಲ್ಲ, ಆದ್ದರಿಂದ ಸುರಕ್ಷಿತ ಫಾಲ್‌ಬ್ಯಾಕ್ ಬಳಸಲಾಗಿದೆ.`;
  } else {
    reply = `You mentioned: “${snippet}${ellipsis}”. This is educational information, not a diagnosis. ${
      red_flags.length
        ? "Follow the urgent guidance first."
        : themes.length
          ? "Related education themes are below."
          : "Please talk with a clinician for personal advice."
    } The ML service was unavailable, so a safe fallback is in use.`;
  }

  const disclaimer =
    language === "hi"
      ? DISCLAIMER_HI
      : language === "kn"
        ? DISCLAIMER_KN
        : DISCLAIMER_EN;

  return {
    reply,
    language,
    themes,
    care: {
      urgency: red_flags.length > 0 ? "urgent" : themes.length ? "soon" : "routine",
      summary:
        red_flags.length > 0
          ? language === "hi"
            ? "पहले लाल-झंडा मार्गदर्शन का पालन करें।"
            : language === "kn"
              ? "ಮೊದಲು ಕೆಂಪು ಧ್ವಜ ಮಾರ್ಗದರ್ಶನವನ್ನು ಅನುಸರಿಸಿ."
              : "Follow the red-flag guidance first."
          : language === "hi"
            ? "नियमित रूप से GP या स्त्री रोग विशेषज्ञ से बात करने पर विचार करें। ML सेवा जुड़ने पर स्रोत और विवरण बेहतर होंगे।"
            : language === "kn"
              ? "GP ಅಥವಾ ಸ್ತ್ರೀರೋಗ ತಜ್ಞರನ್ನು ನೋಡಿ. ML ಸೇವೆ ಚಾಲು ಆದಾಗ ಹೆಚ್ಚು ಮೂಲಗಳು ಕಾಣಿಸುತ್ತವೆ."
              : "Consider talking with a GP or gynecologist. Richer sources will appear when the ML service is running.",
      questions:
        language === "hi"
          ? [
              "क्या मेरे लक्षणों के लिए कौन-सी जाँच सही होगी?",
              "थायरॉइड या अन्य कारण कैसे अलग करें?",
              "मुझे कब विशेषज्ञ के पास जाना चाहिए?",
            ]
          : language === "kn"
            ? [
                "ನನ್ನ ಲಕ್ಷಣಗಳಿಗೆ ಯಾವ ಪರೀಕ್ಷೆಗಳು ಸೂಕ್ತ?",
                "ಥೈರಾಯ್ಡ್ ಅಥವಾ ಇತರ ಕಾರಣಗಳನ್ನು ಹೇಗೆ ಪ್ರತ್ಯೇಕಿಸುವುದು?",
                "ನಾನು ಯಾವಾಗ ತಜ್ಞರನ್ನು ನೋಡಬೇಕು?",
              ]
            : [
                "Which evaluations make sense for my symptom pattern?",
                "How should we rule out thyroid or other causes?",
                "When should I see a specialist?",
              ],
    },
    sources: [],
    red_flags,
    disclaimer,
    engine: "template",
  };
}
