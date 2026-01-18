
from pathlib import Path
import re
from flask import send_from_directory, abort

AUDIO_ROOT = Path("src/szeyapapi/data/pronunciations") #TODO: change placeholder later
DICTIONARIES = {"GC_DICT", "SL_DICT"}

def normalize_for_audio(jyutping: str) -> str:
    jp = jyutping.lower()
    jp = re.sub(r"\s+", "_", jp)
    jp = re.sub(r"[^a-z0-9_]", "", jp)
    return jp

# Return the API URL for the pronunciation audio, or None if missing
def get_audio_url(dictionary: str, jyutping: str) -> str | None:
    if dictionary not in DICTIONARIES:
        return None

    audio_id = normalize_for_audio(jyutping)
    audio_file = AUDIO_ROOT / dictionary / f"{audio_id}.mp3"

    if audio_file.exists():
        return f"/api/pronunciation/{dictionary}/{audio_id}"
    return None

def get_pronunciation(dictionary: str, pronunciation_id: str):
    if dictionary not in DICTIONARIES:
        abort(404, "Invalid dictionary")

    file_path = AUDIO_ROOT / dictionary / f"{pronunciation_id}.mp3"
    if not file_path.exists():
        abort(404, "Audio not found")

    return send_from_directory(file_path.parent, file_path.name, mimetype="audio/mpeg")

# Attach pronunciation URLs to translation results
def attach_pronunciation(translations: list, dictionary: str):
    key = dictionary.replace("_DICT", "")
    for t in translations:
        if t["chinese"]["jyutping"]:
            canonical_jp = t["chinese"]["jyutping"][0].get(key)
            t["pronunciation_url"] = get_audio_url(dictionary, canonical_jp)
        else:
            t["pronunciation_url"] = None
    return translations