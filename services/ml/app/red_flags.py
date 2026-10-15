import re

from .models import RedFlag

RULES = [
    {
        "id": "heavy_bleeding_dizziness",
        "patterns": [
            re.compile(r"heavy\s+bleeding.*(dizzy|faint)", re.I),
            re.compile(r"(dizzy|faint).*(heavy\s+bleed|soaking)", re.I),
            re.compile(r"soaking\s+(through\s+)?(pad|pads)", re.I),
        ],
        "label_en": "Heavy bleeding with dizziness or fainting",
        "label_hi": "चक्कर या बेहोशी के साथ भारी रक्तस्राव",
        "guidance_en": "Seek emergency care now. Do not wait for a routine education visit.",
        "guidance_hi": "अभी आपातकालीन देखभाल लें। नियमित शिक्षा विज़िट का इंतज़ार न करें।",
    },
    {
        "id": "severe_pelvic_pain",
        "patterns": [
            re.compile(r"severe\s+(pelvic|abdominal|stomach)\s+pain", re.I),
            re.compile(r"pet\s+mein\s+bahut\s+tez\s+dard", re.I),
        ],
        "label_en": "Severe pelvic or abdominal pain",
        "label_hi": "तेज़ पेल्विक या पेट दर्द",
        "guidance_en": "Sudden severe pain needs urgent clinical assessment now.",
        "guidance_hi": "अचानक तेज़ दर्द की तुरंत चिकित्सकीय जाँच ज़रूरी है।",
    },
    {
        "id": "pregnancy_concern",
        "patterns": [
            re.compile(r"might\s+be\s+pregnant", re.I),
            re.compile(r"pregnant.*(bleed|pain)", re.I),
            re.compile(r"positive\s+pregnancy\s+test", re.I),
        ],
        "label_en": "Possible pregnancy-related concern",
        "label_hi": "संभावित गर्भावस्था संबंधी चिंता",
        "guidance_en": "If you could be pregnant and have pain or bleeding, seek urgent obstetric or emergency care.",
        "guidance_hi": "गर्भावस्था संभव हो और दर्द या रक्तस्राव हो तो तुरंत प्रसूति या आपातकालीन देखभाल लें।",
    },
    {
        "id": "self_harm",
        "patterns": [
            re.compile(r"suicid", re.I),
            re.compile(r"kill\s+myself", re.I),
            re.compile(r"want\s+to\s+die", re.I),
            re.compile(r"atmahatya", re.I),
        ],
        "label_en": "Thoughts of self-harm or suicide",
        "label_hi": "आत्महत्या या स्वयं को नुकसान के विचार",
        "guidance_en": "Please reach emergency services or a crisis helpline right away.",
        "guidance_hi": "कृपया तुरंत आपातकालीन सेवाओं या क्राइसिस हेल्पलाइन से संपर्क करें।",
    },
    {
        "id": "chest_breath",
        "patterns": [
            re.compile(r"chest\s+pain", re.I),
            re.compile(r"can'?t\s+breathe", re.I),
            re.compile(r"short(ness)?\s+of\s+breath", re.I),
            re.compile(r"saans\s+(nahi|phool)", re.I),
        ],
        "label_en": "Chest pain or breathing difficulty",
        "label_hi": "सीने में दर्द या साँस लेने में तकलीफ",
        "guidance_en": "Chest pain or trouble breathing needs emergency evaluation now.",
        "guidance_hi": "सीने में दर्द या साँस की तकलीफ की अभी आपातकालीन जाँच ज़रूरी है।",
    },
]


def detect_red_flags(text: str, language: str) -> list[RedFlag]:
    hits: list[RedFlag] = []
    for rule in RULES:
        if any(p.search(text) for p in rule["patterns"]):
            hits.append(
                RedFlag(
                    id=rule["id"],
                    label=rule["label_hi"] if language == "hi" else rule["label_en"],
                    guidance=rule["guidance_hi"]
                    if language == "hi"
                    else rule["guidance_en"],
                )
            )
    return hits
