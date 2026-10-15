from __future__ import annotations

import re
from collections import defaultdict

from .config import DISCLAIMER_EN, DISCLAIMER_HI, THEME_TITLES, VALID_THEME_IDS
from .indexer import retrieve
from .language import detect_language
from .models import (
    AnalyzeRequest,
    AnalyzeResponse,
    CareBlock,
    SourceRef,
    ThemeCard,
)
from .ollama_polish import polish_reply
from .red_flags import detect_red_flags

KEYWORD_THEMES: list[tuple[str, re.Pattern[str]]] = [
    ("cycle_irregularity", re.compile(r"period|cycle|mahine|पीरियड|अनियमित|महीन", re.I)),
    ("hirsutism", re.compile(r"facial\s+hair|baal|hirsut|चेहरे पर बाल|chin\s+hair", re.I)),
    ("acne", re.compile(r"acne|pimple|munhase|muhase|मुंहासे", re.I)),
    ("weight_insulin", re.compile(r"weight|badh|insulin|वज़न|vazan|vajan", re.I)),
    ("mood", re.compile(r"mood|anxiety|depress|tension|pareshaan|मूड", re.I)),
    ("hair_loss", re.compile(r"hair\s+fall|hair\s+loss|baal\s+jhad|बाल झड़", re.I)),
    ("fatigue", re.compile(r"fatigue|tired|thakaan|थकान", re.I)),
    ("fertility_concerns", re.compile(r"conceive|fertility|pregnant\s+nahi|गर्भधारण|ovulation", re.I)),
]


def _section_blob(hits: list[tuple[float, dict]], needle: str) -> str:
    needle_l = needle.lower()
    for _, meta in hits:
        if needle_l in meta["section"].lower() or needle_l in meta["text"].lower()[:80]:
            return meta["text"][:500]
    return hits[0][1]["text"][:500] if hits else ""


def _extract_theme_fields(theme_id: str, hits: list[tuple[float, dict]], language: str) -> ThemeCard:
    title_en, title_hi = THEME_TITLES[theme_id]
    relevant = [h for h in hits if theme_id in (h[1].get("theme_ids") or [])] or hits

    summary = _section_blob(relevant, "overview") or _section_blob(relevant, theme_id)
    # Prefer named sections when present across corpus
    pcos = ""
    overlap = ""
    for _, meta in relevant:
        sec = meta["section"].lower()
        if "pcos" in sec and not pcos:
            pcos = meta["text"][:420]
        if "other possible" in sec or "overlap" in sec:
            overlap = meta["text"][:420]

    if not pcos:
        pcos = (
            "In PCOS education this theme is sometimes discussed as an association — not a diagnosis."
            if language == "en"
            else "PCOS शिक्षा में इस विषय की चर्चा एक जुड़ाव के रूप में होती है — निदान नहीं।"
        )
    if not overlap:
        overlap = (
            "Other causes can include thyroid issues, stress, medicines, and lifestyle factors."
            if language == "en"
            else "अन्य कारणों में थायरॉइड, तनाव, दवाएँ और जीवनशैली शामिल हो सकते हैं।"
        )
    if not summary:
        summary = (
            "These symptoms are commonly discussed in women's health education."
            if language == "en"
            else "ये लक्षण महिला स्वास्थ्य शिक्षा में आम चर्चा के विषय हैं।"
        )

    return ThemeCard(
        id=theme_id,
        title=title_hi if language == "hi" else title_en,
        summary=summary[:480],
        pcos_context=pcos[:480],
        overlap=overlap[:480],
    )


def _theme_ids_from_hits(hits: list[tuple[float, dict]], message: str) -> list[str]:
    scores: dict[str, float] = defaultdict(float)
    for score, meta in hits:
        for tid in meta.get("theme_ids") or []:
            if tid in VALID_THEME_IDS:
                scores[tid] += score
    for tid, pattern in KEYWORD_THEMES:
        if pattern.search(message):
            scores[tid] += 0.15
    ranked = sorted(scores.items(), key=lambda x: -x[1])
    return [t for t, _ in ranked[:3]]


def _questions(theme_ids: list[str], language: str, hits: list[tuple[float, dict]]) -> list[str]:
    found: list[str] = []
    for _, meta in hits:
        if "question" in meta["section"].lower():
            for line in meta["text"].splitlines():
                line = line.strip(" -*\t")
                if len(line) > 20:
                    found.append(line)
    if found:
        return found[:5]
    if language == "hi":
        return [
            "क्या मेरे लक्षणों के लिए कौन-सी जाँच सही होगी?",
            "थायरॉइड या अन्य कारण कैसे अलग करें?",
            "मुझे कब विशेषज्ञ के पास जाना चाहिए?",
        ]
    return [
        "Which evaluations make sense for my symptom pattern?",
        "How should we rule out thyroid or other causes?",
        "When should I see a specialist?",
    ]


def _care_summary(language: str, urgent: bool, theme_ids: list[str], hits: list[tuple[float, dict]]) -> str:
    if urgent:
        return (
            "Follow the red-flag guidance first. Education cards are secondary."
            if language == "en"
            else "पहले लाल-झंडा मार्गदर्शन का पालन करें। शिक्षा कार्ड द्वितीयक हैं।"
        )
    for _, meta in hits:
        if "care pathway" in meta["section"].lower():
            return meta["text"][:400]
    if theme_ids:
        return (
            "Consider a soon appointment with a GP or gynecologist to discuss these educational themes — not as a diagnosis."
            if language == "en"
            else "इन शैक्षिक विषयों पर चर्चा के लिए GP या स्त्री रोग विशेषज्ञ से जल्द मिलने पर विचार करें — यह निदान नहीं है।"
        )
    return (
        "Retrieval was weak. Please talk with a clinician for personal advice."
        if language == "en"
        else "मज़बूत जानकारी नहीं मिली। व्यक्तिगत सलाह के लिए चिकित्सक से बात करें।"
    )


def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    language = (
        req.locale
        if req.locale in ("en", "hi")
        else detect_language(req.message)
    )
    red_flags = detect_red_flags(req.message, language)
    hits = retrieve(req.message)

    if red_flags:
        theme_ids: list[str] = []
        themes: list[ThemeCard] = []
    else:
        theme_ids = _theme_ids_from_hits(hits, req.message)
        themes = [_extract_theme_fields(tid, hits, language) for tid in theme_ids]

    sources = [
        SourceRef(title=meta["source"], section=meta["section"])
        for _, meta in hits[:4]
    ]
    # dedupe sources
    seen = set()
    uniq_sources: list[SourceRef] = []
    for s in sources:
        key = (s.title, s.section)
        if key not in seen:
            seen.add(key)
            uniq_sources.append(s)

    snippet = req.message.strip()[:110]
    if language == "hi":
        reply = (
            f"आपने बताया: “{snippet}{'…' if len(req.message) > 110 else ''}”. "
            "यह शैक्षिक जानकारी है, निदान नहीं। "
        )
        if red_flags:
            reply += "पहले तात्कालिक मार्गदर्शन देखें।"
        elif themes:
            titles = ", ".join(t.title for t in themes)
            reply += f"संबंधित शिक्षा विषय: {titles}।"
        else:
            reply += "कृपया चिकित्सक से बात करें।"
    else:
        reply = (
            f"You mentioned: “{snippet}{'…' if len(req.message) > 110 else ''}”. "
            "This is educational information, not a diagnosis. "
        )
        if red_flags:
            reply += "Follow the urgent guidance first."
        elif themes:
            titles = ", ".join(t.title for t in themes)
            reply += f"Related education themes: {titles}."
        else:
            reply += "Please talk with a clinician for personal advice."

    engine = "template"
    polished = polish_reply(reply, req.message, language)
    if polished:
        reply = polished
        engine = "hybrid"

    urgency = "urgent" if red_flags else ("soon" if themes else "routine")

    return AnalyzeResponse(
        reply=reply,
        language=language,  # type: ignore[arg-type]
        themes=themes,
        care=CareBlock(
            urgency=urgency,  # type: ignore[arg-type]
            summary=_care_summary(language, bool(red_flags), theme_ids, hits),
            questions=_questions(theme_ids, language, hits),
        ),
        sources=uniq_sources,
        red_flags=red_flags,
        disclaimer=DISCLAIMER_HI if language == "hi" else DISCLAIMER_EN,
        engine=engine,  # type: ignore[arg-type]
    )
