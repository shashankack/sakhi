import re

# Devanagari (Hindi) · Kannada
_DEVANAGARI = re.compile(r"[\u0900-\u097F]")
_KANNADA = re.compile(r"[\u0C80-\u0CFF]")

_HI_PARTICLES = re.compile(
    r"\b(nahi|aaye|baal|mahine|chehre|raha|hain|hai|mera|meri|mujhe|bahut|thakaan|muhase|munhase)\b",
    flags=re.I,
)
_KN_PARTICLES = re.compile(
    r"\b(illa|ide|iddene|nanna|nanage|bahala|thumba|kelasa|madtide|agtide|period\s*baralla|koodalu|thoo?ka)\b",
    flags=re.I,
)


def detect_language(text: str) -> str:
    if _KANNADA.search(text):
        return "kn"
    if _DEVANAGARI.search(text):
        return "hi"

    kn_hits = len(_KN_PARTICLES.findall(text))
    if kn_hits >= 2:
        return "kn"

    hi_hits = len(_HI_PARTICLES.findall(text))
    # Hinglish: Hindi particles mixed with English symptom words
    return "hi" if hi_hits >= 2 else "en"
