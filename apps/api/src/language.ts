export function detectLanguage(text: string): "en" | "hi" | "kn" {
  if (/[\u0C80-\u0CFF]/.test(text)) return "kn";
  if (/[\u0900-\u097F]/.test(text)) return "hi";

  const kn =
    /\b(illa|ide|iddene|nanna|nanage|bahala|thumba|kelasa|madtide|agtide|koodalu)\b/i;
  if ((text.match(kn) || []).length >= 2) return "kn";

  const hinglish =
    /\b(nahi|aaye|baal|mahine|chehre|thakaan|muhase|badh|raha|hai|hain|mera|meri|mujhe|bahut)\b/i;
  const hits = (text.match(hinglish) || []).length;
  return hits >= 2 ? "hi" : "en";
}
