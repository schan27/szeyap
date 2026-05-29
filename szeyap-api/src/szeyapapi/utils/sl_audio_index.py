import json
from pathlib import Path
from szeyapapi.config import STEPHEN_LI_DICTIONARY_PATH
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as lang

SL_DICT_PATH = Path(STEPHEN_LI_DICTIONARY_PATH)
_sl_audio_index: dict | None = None

def load_sl_audio_index() -> dict:
    with open(SL_DICT_PATH, encoding="utf-8") as f:
        entries = json.load(f)

    index = {}
    for entry in entries:
        url = entry.get("taishaneseAudio")
        if not url:
            continue

        # Run through the same normalization as stephenli_dictionary.py
        raw = entry.get("taishaneseRomanization", "")
        penyim_string = raw.replace("[", "").replace("]", "")
        splitted = penyim_string.split("/")
        penyim_string = " ".join(s.strip() for s in splitted if not s.isdigit())

        try:
            sl_romanization = Penyim(penyim_string, lang.SL).as_dict().get(lang.SL, "")
        except Exception:
            sl_romanization = ""

        for key in ("taishanese", "cantonese", "mandarin"):
            val = entry.get(key)
            if val:
                index[(val, sl_romanization)] = url

    return index


def get_sl_audio_index() -> dict:
    global _sl_audio_index
    if _sl_audio_index is None:
        _sl_audio_index = load_sl_audio_index()
    return _sl_audio_index