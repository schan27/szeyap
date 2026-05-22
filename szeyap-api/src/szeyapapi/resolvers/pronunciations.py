
from pathlib import Path
import re
from flask import send_from_directory, abort

from ..utils.audio_index import get_audio_index

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
        raise ValueError(f"Unknown dictionary: {dictionary!r}")
 
    audio_id = normalize_for_audio(jyutping)
 
    index = get_audio_index()
    if audio_id not in index:
        raise KeyError(f"No audio found for jyutping {jyutping!r} (normalised: {audio_id!r})")
 
    return f"/api/pronunciation/{dictionary}/{audio_id}"

# Flask route handler to serve the pronunciation audio files
def get_pronunciation(dictionary: str, pronunciation_id: str):
    if dictionary not in DICTIONARIES:
        abort(404, "Invalid dictionary")
 
    file_path = AUDIO_ROOT / dictionary / f"{pronunciation_id}.mp3"
    if not file_path.exists():
        abort(404, "Audio not found")
 
    return send_from_directory(file_path.parent, file_path.name, mimetype="audio/mpeg")

# Given a list of translations, attach pronunciation URLs where possible based on the jyutping and dictionary
def attach_pronunciation(translations: list, dictionary: str):
    key = dictionary.replace("_DICT", "")
    for t in translations:
        jyutping_list = t["chinese"].get("jyutping")
        if jyutping_list:
            canonical_jp = jyutping_list[0].get(key)
            if canonical_jp:
                t["pronunciation_url"] = get_audio_url(dictionary, canonical_jp)
            else:
                t["pronunciation_url"] = None
        else:
            t["pronunciation_url"] = None
    return translations