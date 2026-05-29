import re
from pathlib import Path

from flask import abort, redirect, send_from_directory
from szeyapapi.dictionaries.stephenli_dictionary import SL

AUDIO_ROOT = Path(__file__).parent / "data" / "pronunciations"
DICTIONARIES = {"GC_DICT", "SL_DICT"}


def normalize_for_audio(jyutping: str) -> str:
    jp = jyutping.lower()
    jp = re.sub(r"\s+", "_", jp)
    jp = re.sub(r"[^a-z0-9_]", "", jp)
    return jp


# Lookup the audio URL for a given dictionary, lookup key, and SL romanization, returning None if not found
def get_audio_url(
    dictionary: str, lookup_key: str, sl_romanization: str = ""
) -> tuple[str, str]:
    if dictionary not in DICTIONARIES:
        raise ValueError(f"Unknown dictionary: {dictionary!r}")

    if dictionary == "SL_DICT":
        index = SL.audio_index
        url = index.get((lookup_key, sl_romanization))
        if not url:
            raise KeyError(
                f"No audio found for {lookup_key!r} / {sl_romanization!r} in SL index"
            )
        return lookup_key, url

    # GC_DICT — not yet implemented, return None gracefully
    return None, None


# Flask route handler to serve the pronunciation audio files - BACKUP ONLY, as these are not currently used in production
def get_pronunciation(dictionary: str, pronunciation_id: str):
    if dictionary not in DICTIONARIES:
        abort(404, "Invalid dictionary")

    if dictionary == "SL_DICT":
        index = SL.audio_index
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
    for t in translations:
        chinese = t.get("chinese", {})

        simp = chinese.get("simplified")
        trad = chinese.get("traditional")

        lookup_key = None
        if simp and simp[0]:
            lookup_key = simp[0]
        elif trad and trad[0]:
            lookup_key = trad[0]

        # penyim[0]["SL"] matches the SL romanization used as the index key, hopefully - Jackson
        penyim_list = chinese.get("penyim")
        sl_romanization = ""
        if penyim_list and penyim_list[0]:
            sl_romanization = penyim_list[0].get("SL", "")

        if lookup_key:
            pronunciation_id, pronunciation_url = get_audio_url(
                dictionary, lookup_key, sl_romanization
            )
            t["pronunciation_id"] = pronunciation_id
            t["pronunciation_url"] = pronunciation_url
        else:
            t["pronunciation_id"] = None
            t["pronunciation_url"] = None

    return translations
