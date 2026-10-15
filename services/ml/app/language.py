import re


def detect_language(text: str) -> str:
    if re.search(r"[\u0900-\u097F]", text):
        return "hi"
    hints = re.findall(
        r"\b(nahi|aaye|baal|mahine|chehre|thakaan|muhase|munhase|badh|raha|hai|hain|mera|meri|mujhe|bahut|periods?)\b",
        text,
        flags=re.I,
    )
    # hinglish often mixes English symptom words with Hindi particles
    hi_particles = re.findall(
        r"\b(nahi|aaye|baal|mahine|chehre|raha|hain|hai|mera|meri|mujhe|bahut)\b",
        text,
        flags=re.I,
    )
    return "hi" if len(hi_particles) >= 2 or len(hints) >= 4 else "en"
