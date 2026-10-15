from __future__ import annotations

import re
from collections import defaultdict

from .config import (
    DISCLAIMER_EN,
    DISCLAIMER_HI,
    DISCLAIMER_KN,
    THEME_TITLES,
    VALID_THEME_IDS,
)
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
    (
        "cycle_irregularity",
        re.compile(
            r"period|cycle|mahine|पीरियड|अनियमित|महीन|ಪೀರಿಯಡ್|ಅನಿಯಮಿತ|ಮಾಸಿಕ",
            re.I,
        ),
    ),
    (
        "hirsutism",
        re.compile(
            r"facial\s+hair|baal|hirsut|चेहरे पर बाल|chin\s+hair|ಕೂದಲು|ಮುಖದ\s*ಕೂದಲು",
            re.I,
        ),
    ),
    ("acne", re.compile(r"acne|pimple|munhase|muhase|मुंहासे|ಮೊಡವೆ", re.I)),
    (
        "weight_insulin",
        re.compile(r"weight|badh|insulin|वज़न|vazan|vajan|ತೂಕ|ಹಸಿವು", re.I),
    ),
    ("mood", re.compile(r"mood|anxiety|depress|tension|pareshaan|मूड|ಮನೋಭಾವ", re.I)),
    (
        "hair_loss",
        re.compile(r"hair\s+fall|hair\s+loss|baal\s+jhad|बाल झड़|ಕೂದಲು\s*ಉದುರ", re.I),
    ),
    ("fatigue", re.compile(r"fatigue|tired|thakaan|थकान|ಆಯಾಸ|ದಣಿವು", re.I)),
    (
        "fertility_concerns",
        re.compile(
            r"conceive|fertility|pregnant\s+nahi|गर्भधारण|ovulation|ಗರ್ಭಧಾರಣೆ",
            re.I,
        ),
    ),
]


def _is_alias_chunk(meta: dict) -> bool:
    sec = (meta.get("section") or "").lower()
    text = (meta.get("text") or "").lower()
    if any(tok in sec for tok in ("alias", "phrase map", "glossary")):
        return True
    if text.startswith("english:") and "hindi" in text[:200]:
        return True
    if "key demo phrases" in text:
        return True
    return False


def _clean_prose(text: str, limit: int = 320) -> str:
    cleaned = (text or "").strip()
    if _is_alias_chunk({"section": "", "text": cleaned}):
        return ""
    # Drop markdown noise so cards/replies stay conversational.
    cleaned = re.sub(r"^#+\s*", "", cleaned, flags=re.M)
    cleaned = re.sub(r"\*\*([^*]+)\*\*", r"\1", cleaned)
    cleaned = re.sub(r"(?m)^\s*[-*•]\s+", "", cleaned)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    lower = cleaned.lower()
    # Skip checklist / bullet dumps — they read poorly in chat cards.
    if cleaned.count(":") >= 2 and cleaned.count(".") <= 1:
        return ""
    if lower.startswith(("the nhs advises", "the nhs says see", "- routine", "- urgent")):
        return ""
    if len(re.findall(r"\byour periods\b", lower)) >= 2:
        return ""
    return cleaned[:limit]


_SUMMARY_SKIP_SECTIONS = ("care pathway", "red flag", "alias", "phrase map", "glossary")


def _section_blob(hits: list[tuple[float, dict]], needle: str) -> str:
    needle_l = needle.lower()
    for _, meta in hits:
        if _is_alias_chunk(meta):
            continue
        sec = meta["section"].lower()
        if any(skip in sec for skip in _SUMMARY_SKIP_SECTIONS):
            continue
        if needle_l in sec or needle_l in meta["text"].lower()[:80]:
            prose = _clean_prose(meta["text"], 420)
            if prose:
                return prose
    for _, meta in hits:
        if _is_alias_chunk(meta):
            continue
        sec = meta["section"].lower()
        if any(skip in sec for skip in _SUMMARY_SKIP_SECTIONS):
            continue
        prose = _clean_prose(meta["text"], 420)
        if prose:
            return prose
    return ""


def _t(language: str, en: str, hi: str, kn: str) -> str:
    if language == "hi":
        return hi
    if language == "kn":
        return kn
    return en


def _theme_title(theme_id: str, language: str) -> str:
    title_en, title_hi, title_kn = THEME_TITLES[theme_id]
    return _t(language, title_en, title_hi, title_kn)


def _extract_theme_fields(theme_id: str, hits: list[tuple[float, dict]], language: str) -> ThemeCard:
    relevant = [h for h in hits if theme_id in (h[1].get("theme_ids") or [])] or hits

    summary = (
        _section_blob(relevant, "overview")
        or _section_blob(relevant, "pcos education")
        or _section_blob(relevant, "other possible")
        or _section_blob(relevant, "self-care")
        or _section_blob(relevant, theme_id)
    )
    # Prefer named sections when present across corpus
    pcos = ""
    overlap = ""
    for _, meta in relevant:
        if _is_alias_chunk(meta):
            continue
        sec = meta["section"].lower()
        if "pcos" in sec and not pcos:
            pcos = _clean_prose(meta["text"], 360)
        if "other possible" in sec or "overlap" in sec:
            overlap = _clean_prose(meta["text"], 360)

    if not pcos:
        pcos = _t(
            language,
            "In PCOS education this theme is sometimes discussed as an association — not a diagnosis.",
            "PCOS शिक्षा में इस विषय की चर्चा एक जुड़ाव के रूप में होती है — निदान नहीं।",
            "PCOS ಶಿಕ್ಷಣದಲ್ಲಿ ಈ ವಿಷಯವನ್ನು ಸಂಬಂಧವಾಗಿ ಚರ್ಚಿಸಲಾಗುತ್ತದೆ — ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ.",
        )
    if not overlap:
        overlap = _t(
            language,
            "Other causes can include thyroid issues, stress, medicines, and lifestyle factors.",
            "अन्य कारणों में थायरॉइड, तनाव, दवाएँ और जीवनशैली शामिल हो सकते हैं।",
            "ಥೈರಾಯ್ಡ್, ಒತ್ತಡ, ಔಷಧಗಳು ಮತ್ತು ಜೀವನಶೈಲಿಯೂ ಕಾರಣವಾಗಬಹುದು.",
        )
    # Corpus is mostly English — for HI/KN use short localized card copy.
    if language in ("hi", "kn"):
        summary = _t(
            language,
            summary,
            "ये लक्षण महिला स्वास्थ्य शिक्षा में आम चर्चा के विषय हैं — कई कारण हो सकते हैं।",
            "ಈ ಲಕ್ಷಣಗಳು ಮಹಿಳಾ ಆರೋಗ್ಯ ಶಿಕ್ಷಣದಲ್ಲಿ ಸಾಮಾನ್ಯ — ಹಲವು ಕಾರಣಗಳಿರಬಹುದು.",
        )
        pcos = _t(
            language,
            pcos,
            "PCOS शिक्षा में इस विषय की चर्चा एक जुड़ाव के रूप में होती है — निदान नहीं।",
            "PCOS ಶಿಕ್ಷಣದಲ್ಲಿ ಈ ವಿಷಯವನ್ನು ಸಂಬಂಧವಾಗಿ ಚರ್ಚಿಸಲಾಗುತ್ತದೆ — ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ.",
        )
        overlap = _t(
            language,
            overlap,
            "अन्य कारणों में थायरॉइड, तनाव, दवाएँ और जीवनशैली शामिल हो सकते हैं।",
            "ಥೈರಾಯ್ಡ್, ಒತ್ತಡ, ಔಷಧಗಳು ಮತ್ತು ಜೀವನಶೈಲಿಯೂ ಕಾರಣವಾಗಬಹುದು.",
        )
    if not summary:
        summary = _t(
            language,
            "These symptoms are commonly discussed in women's health education.",
            "ये लक्षण महिला स्वास्थ्य शिक्षा में आम चर्चा के विषय हैं।",
            "ಈ ಲಕ್ಷಣಗಳು ಮಹಿಳಾ ಆರೋಗ್ಯ ಶಿಕ್ಷಣದಲ್ಲಿ ಸಾಮಾನ್ಯವಾಗಿ ಚರ್ಚಿಸಲಾಗುತ್ತದೆ.",
        )

    return ThemeCard(
        id=theme_id,
        title=_theme_title(theme_id, language),
        summary=_first_sentence(summary, 280) or summary[:280],
        pcos_context=_first_sentence(pcos, 220) or pcos[:220],
        overlap=_first_sentence(overlap, 220) or overlap[:220],
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
    if language == "kn":
        return [
            "ನನ್ನ ಲಕ್ಷಣಗಳಿಗೆ ಯಾವ ಪರೀಕ್ಷೆಗಳು ಸೂಕ್ತ?",
            "ಥೈರಾಯ್ಡ್ ಅಥವಾ ಇತರ ಕಾರಣಗಳನ್ನು ಹೇಗೆ ಪ್ರತ್ಯೇಕಿಸುವುದು?",
            "ನಾನು ಯಾವಾಗ ತಜ್ಞರನ್ನು ನೋಡಬೇಕು?",
        ]
    return [
        "Which evaluations make sense for my symptom pattern?",
        "How should we rule out thyroid or other causes?",
        "When should I see a specialist?",
    ]


def _care_summary(language: str, urgent: bool, theme_ids: list[str], hits: list[tuple[float, dict]]) -> str:
    if urgent:
        return _t(
            language,
            "Follow the red-flag guidance first. Education cards are secondary.",
            "पहले लाल-झंडा मार्गदर्शन का पालन करें। शिक्षा कार्ड द्वितीयक हैं।",
            "ಮೊದಲು ಕೆಂಪು ಧ್ವಜ ಮಾರ್ಗದರ್ಶನವನ್ನು ಅನುಸರಿಸಿ. ಶಿಕ್ಷಣ ಕಾರ್ಡ್‌ಗಳು ದ್ವಿತೀಯ.",
        )
    if theme_ids:
        return _t(
            language,
            "Consider a soon appointment with a GP or gynecologist to discuss these educational themes — not as a diagnosis.",
            "इन शैक्षिक विषयों पर चर्चा के लिए GP या स्त्री रोग विशेषज्ञ से जल्द मिलने पर विचार करें — यह निदान नहीं है।",
            "ಈ ಶೈಕ್ಷಣಿಕ ವಿಷಯಗಳನ್ನು ಚರ್ಚಿಸಲು GP ಅಥವಾ ಸ್ತ್ರೀರೋಗ ತಜ್ಞರನ್ನು ಶೀಘ್ರದಲ್ಲೇ ನೋಡಿ — ಇದು ರೋಗನಿರ್ಣಯವಲ್ಲ.",
        )
    return _t(
        language,
        "Retrieval was weak. Please talk with a clinician for personal advice.",
        "मज़बूत जानकारी नहीं मिली। व्यक्तिगत सलाह के लिए चिकित्सक से बात करें।",
        "ಸಾಕಷ್ಟು ಮಾಹಿತಿ ಸಿಗಲಿಲ್ಲ. ವೈಯಕ್ತಿಕ ಸಲಹೆಗಾಗಿ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    )


def _first_sentence(text: str, limit: int = 220) -> str:
    cleaned = re.sub(r"\s+", " ", (text or "").strip())
    if not cleaned:
        return ""
    match = re.search(r"(.+?[.!?।॥])(\s|$)", cleaned)
    sentence = match.group(1).strip() if match else cleaned
    if len(sentence) > limit:
        return sentence[: limit - 1].rsplit(" ", 1)[0].rstrip(",.;:") + "…"
    return sentence


def _build_reply(
    message: str,
    language: str,
    urgent: bool,
    themes: list[ThemeCard],
) -> str:
    """Warm educational opener; includes one retrieved insight when available."""
    lead = _t(
        language,
        "Thanks for sharing what you’ve noticed — this is educational information, not a diagnosis.",
        "आपने जो बताया उसके लिए धन्यवाद — यह शैक्षिक जानकारी है, निदान नहीं।",
        "ನೀವು ಹಂಚಿಕೊಂಡಿದ್ದಕ್ಕೆ ಧನ್ಯವಾದಗಳು — ಇದು ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ, ರೋಗನಿರ್ಣಯವಲ್ಲ.",
    )
    if urgent:
        return (
            lead
            + " "
            + _t(
                language,
                "Some of what you described needs urgent care first — follow the guidance above, then talk with a clinician.",
                "आपके कुछ लक्षणों के लिए पहले तात्कालिक देखभाल ज़रूरी है — ऊपर दिए मार्गदर्शन का पालन करें, फिर चिकित्सक से बात करें।",
                "ನೀವು ಹೇಳಿದ ಕೆಲವು ಲಕ್ಷಣಗಳಿಗೆ ಮೊದಲು ತುರ್ತು ಆರೈಕೆ ಬೇಕು — ಮೇಲಿನ ಮಾರ್ಗದರ್ಶನವನ್ನು ಅನುಸರಿಸಿ, ನಂತರ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
            )
        )

    if not themes:
        return (
            lead
            + " "
            + _t(
                language,
                "I could not match a clear education theme yet. A GP or gynecologist can help you sort through next steps.",
                "अभी कोई स्पष्ट शिक्षा विषय नहीं मिला। GP या स्त्री रोग विशेषज्ञ अगले कदम तय करने में मदद कर सकते हैं।",
                "ಸ್ಪಷ್ಟ ಶಿಕ್ಷಣ ವಿಷಯ ಇನ್ನೂ ಸಿಗಲಿಲ್ಲ. GP ಅಥವಾ ಸ್ತ್ರೀರೋಗ ತಜ್ಞರು ಮುಂದಿನ ಹಂತಗಳನ್ನು ಸ್ಪಷ್ಟಪಡಿಸಬಹುದು.",
            )
        )

    titles = ", ".join(t.title for t in themes[:3])
    # Only weave retrieved English prose into English replies.
    insight = ""
    if language == "en":
        insight = _first_sentence(themes[0].summary)
        if insight and (
            insight.lower().startswith(("the nhs", "- "))
            or insight.count("- ") >= 2
        ):
            insight = ""

    if insight:
        body = f"{insight} Related topics below: {titles}."
    else:
        body = _t(
            language,
            f"Related education topics below: {titles}. A clinician can help you decide what to check next.",
            f"नीचे संबंधित शिक्षा विषय हैं: {titles}। आगे क्या जाँचें, चिकित्सक बता सकते हैं।",
            f"ಕೆಳಗೆ ಸಂಬಂಧಿತ ಶಿಕ್ಷಣ ವಿಷಯಗಳಿವೆ: {titles}. ಮುಂದೆ ಏನು ಪರೀಕ್ಷಿಸಬೇಕು ಎನ್ನುವುದನ್ನು ವೈದ್ಯರು ಸೂಚಿಸಬಹುದು.",
        )
    return f"{lead} {body}"


def analyze(req: AnalyzeRequest) -> AnalyzeResponse:
    language = (
        req.locale
        if req.locale in ("en", "hi", "kn")
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

    reply = _build_reply(req.message, language, bool(red_flags), themes)

    engine = "template"
    polished = polish_reply(reply, req.message, language)
    if polished:
        reply = polished
        engine = "hybrid"

    urgency = "urgent" if red_flags else ("soon" if themes else "routine")
    if language == "hi":
        disclaimer = DISCLAIMER_HI
    elif language == "kn":
        disclaimer = DISCLAIMER_KN
    else:
        disclaimer = DISCLAIMER_EN

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
        disclaimer=disclaimer,
        engine=engine,  # type: ignore[arg-type]
    )
