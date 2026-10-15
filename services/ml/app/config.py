import os
from pathlib import Path

SERVICE_ROOT = Path(__file__).resolve().parents[1]
REPO_ROOT = SERVICE_ROOT.parents[1]

RESEARCH_CORPUS = REPO_ROOT / "research" / "corpus"
SEED_CORPUS = SERVICE_ROOT / "seed_corpus"
DATA_DIR = SERVICE_ROOT / "data"
INDEX_PATH = DATA_DIR / "index.npz"
META_PATH = DATA_DIR / "chunks.json"

EMBED_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
TOP_K = 4
MIN_SCORE = 0.22

# Teammate Ollama (tunnel to their :11434). Internal llama-server ports (62xxx) change  never tunnel those.
OLLAMA_ENABLED = os.getenv("OLLAMA_ENABLED", "0").strip().lower() in {"1", "true", "yes"}
OLLAMA_URL = os.getenv("OLLAMA_URL", "http://127.0.0.1:11434/api/generate").rstrip("/")
if not OLLAMA_URL.endswith("/api/generate"):
    OLLAMA_URL = f"{OLLAMA_URL.rstrip('/')}/api/generate"
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")
OLLAMA_TIMEOUT_S = float(os.getenv("OLLAMA_TIMEOUT_S", "45"))

DISCLAIMER_EN = (
    "This is not a medical diagnosis. Aai shares educational information only. "
    "Many symptoms overlap with other causes  talk to a qualified clinician. "
    "In an emergency, call local emergency services."
)
DISCLAIMER_HI = (
    "यह चिकित्सा निदान नहीं है। आई केवल शैक्षिक जानकारी साझा करती है। "
    "कई लक्षण अन्य कारणों से भी हो सकते हैं  योग्य चिकित्सक से बात करें। "
    "आपात स्थिति में स्थानीय आपातकालीन सेवाओं को कॉल करें।"
)
DISCLAIMER_KN = (
    "ಇದು ವೈದ್ಯಕೀಯ ರೋಗನಿರ್ಣಯವಲ್ಲ. ಆಯಿ ಕೇವಲ ಶೈಕ್ಷಣಿಕ ಮಾಹಿತಿ ಹಂಚಿಕೊಳ್ಳುತ್ತದೆ. "
    "ಅನೇಕ ಲಕ್ಷಣಗಳು ಇತರ ಕಾರಣಗಳಿಂದಲೂ ಆಗಬಹುದು  ಅರ್ಹ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ. "
    "ತುರ್ತು ಸಂದರ್ಭದಲ್ಲಿ ಸ್ಥಳೀಯ ತುರ್ತು ಸೇವೆಗಳನ್ನು ಕರೆ ಮಾಡಿ."
)

# (English, Hindi, Kannada)
THEME_TITLES = {
    "cycle_irregularity": (
        "Menstrual cycle changes",
        "मासिक धर्म चक्र में बदलाव",
        "ಮಾಸಿಕ ಚಕ್ರದ ಬದಲಾವಣೆಗಳು",
    ),
    "hirsutism": (
        "Unwanted facial or body hair",
        "अवांछित चेहरे / शरीर के बाल",
        "ಅನಪೇಕ್ಷಿತ ಮುಖ / ದೇಹದ ಕೂದಲು",
    ),
    "acne": ("Acne that is hard to clear", "मुंहासे", "ಮೊಡವೆ"),
    "weight_insulin": (
        "Weight and appetite changes",
        "वज़न और भूख में बदलाव",
        "ತೂಕ ಮತ್ತು ಹಸಿವಿನ ಬದಲಾವಣೆ",
    ),
    "mood": (
        "Mood and emotional wellbeing",
        "मूड और भावनात्मक स्वास्थ्य",
        "ಮನೋಭಾವ ಮತ್ತು ಭಾವನಾತ್ಮಕ ಆರೋಗ್ಯ",
    ),
    "hair_loss": (
        "Hair thinning or hair fall",
        "बाल पतले होना या झड़ना",
        "ಕೂದಲು ತೆಳುವಾಗುವುದು ಅಥವಾ ಉದುರುವುದು",
    ),
    "fatigue": ("Ongoing tiredness", "लगातार थकान", "ನಿರಂತರ ಆಯಾಸ"),
    "fertility_concerns": (
        "Trying to conceive",
        "गर्भधारण की कोशिश",
        "ಗರ್ಭಧಾರಣೆಯ ಪ್ರಯತ್ನ",
    ),
}

VALID_THEME_IDS = set(THEME_TITLES.keys())
