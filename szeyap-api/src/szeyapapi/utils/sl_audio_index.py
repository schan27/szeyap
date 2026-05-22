import json
from pathlib import Path
 
SL_DICT_PATH = Path("src/szeyapapi/data/stephenli_dictionary.json") 
 
AUDIO_BASE_URL = "https://taishandict.com/"
_SL_OLD_BASE = "http://www.stephen-li.com/TaishaneseVocabulary/"
 
_sl_audio_index: dict | None = None
 
 
def load_sl_audio_index() -> dict:
    with open(SL_DICT_PATH, encoding="utf-8") as f:
        entries = json.load(f)
 
    index = {}
    for entry in entries:
        raw_url = entry.get("taishaneseAudio")
        if not raw_url:
            continue
 
        url = AUDIO_BASE_URL + raw_url.removeprefix(_SL_OLD_BASE)
 
        for key in ("taishanese", "cantonese", "mandarin"):
            val = entry.get(key)
            if val:
                index[val] = url
 
    return index
 
 
def get_sl_audio_index() -> dict:
    """Return the cached SL audio index, loading from JSON once on first call."""
    global _sl_audio_index
    if _sl_audio_index is None:
        _sl_audio_index = load_sl_audio_index()
    return _sl_audio_index