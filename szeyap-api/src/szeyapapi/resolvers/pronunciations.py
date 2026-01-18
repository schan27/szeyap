
from pathlib import Path
import re

AUDIO_ROOT = Path("intestine.mp3") #TODO: change placeholder later
DICTIONARIES = {"GC_DICT", "SL_DICT"}

def normalize_for_audio(jyutping: str) -> str:
    # Normalize Jyutping to a safe filename for audio
    jp = jyutping.lower()
    jp = re.sub(r"\s+", "_", jp)
    jp = re.sub(r"[^a-z0-9_]", "", jp)
    return jp

def get_audio_url(dictionary: str, jyutping: str) -> str | None:
    # Return the audio URL for a given Jyutping, or None if missing
    if dictionary not in DICTIONARIES:
        return None

    audio_id = normalize_for_audio(jyutping)
    audio_file = AUDIO_ROOT / dictionary / f"{audio_id}.mp3"

    if audio_file.exists():
        return f"/api/pronunciation/{dictionary}/{audio_id}"
    return None
