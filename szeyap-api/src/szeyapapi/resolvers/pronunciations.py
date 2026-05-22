
from pathlib import Path
import re
from flask import send_from_directory, abort, redirect

from ..utils.sl_audio_index import get_sl_audio_index

AUDIO_ROOT = Path("src/szeyapapi/data/pronunciations") #TODO: change placeholder later
DICTIONARIES = {"GC_DICT", "SL_DICT"}

def normalize_for_audio(jyutping: str) -> str:
    jp = jyutping.lower()
    jp = re.sub(r"\s+", "_", jp)
    jp = re.sub(r"[^a-z0-9_]", "", jp)
    return jp

# Lookup the audio URL for a given dictionary and Jyutping, returning None if not found
def get_audio_url(dictionary: str, jyutping: str) -> str | None:
    if dictionary not in DICTIONARIES:
        raise ValueError(f"Unknown dictionary: {dictionary!r}")

    if dictionary == "SL_DICT":
        index = get_sl_audio_index()
        if jyutping not in index:
            raise KeyError(f"No audio found for {jyutping!r} in SL index")
        url = index[jyutping]
        pronunciation_id = url.split("/")[-1]
        return pronunciation_id, url

    # GC_DICT — not yet implemented, return None gracefully
    return None, None

# Flask route handler to serve the pronunciation audio files
def get_pronunciation(dictionary: str, pronunciation_id: str):
    if dictionary not in DICTIONARIES:
        abort(404, "Invalid dictionary")
 
    if dictionary == "SL_DICT":
        index = get_sl_audio_index()
        # pronunciation_id is the filename segment — find the matching full URL
        url = next((u for u in index.values() if u.endswith(pronunciation_id)), None)
        if not url:
            abort(404, "Audio not found")
        return redirect(url)
 
    # GC_DICT — serve from disk for testing, but in practice these will likely be hosted externally like SL audio
    file_path = AUDIO_ROOT / dictionary / f"{pronunciation_id}.mp3"
    if not file_path.exists():
        abort(404, "Audio not found")
 
    return send_from_directory(file_path.parent, file_path.name, mimetype="audio/mpeg")

# Attach pronunciation URLs to the translations based on the Chinese characters
def attach_pronunciation(translations: list, dictionary: str) -> list:
    print(f"attach_pronunciation called: {dictionary}, {len(translations)} items")
    for t in translations:
        chinese = t.get("chinese", {})
 
        simp = chinese.get("simplified")
        trad = chinese.get("traditional")
 
        lookup_key = None
        if simp and simp[0]:
            lookup_key = simp[0]
        elif trad and trad[0]:
            lookup_key = trad[0]
 
        if lookup_key:
            pronunciation_id, pronunciation_url = get_audio_url(dictionary, lookup_key)
            t["pronunciation_id"] = pronunciation_id
            t["pronunciation_url"] = pronunciation_url
        else:
            t["pronunciation_id"] = None
            t["pronunciation_url"] = None
 
    return translations