export function detectLanguage(text: string): "en" | "hi" {
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  const hinglish =
    /\b(nahi|aaye|baal|mahine|chehre|thakaan|muhase|badh|raha|hai|hain|mera|meri|mujhe|bahut)\b/i;
  const hits = (text.match(hinglish) || []).length;
  return hits >= 2 ? "hi" : "en";
}
