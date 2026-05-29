import json

from szeyapapi.config import STEPHEN_LI_DICTIONARY_PATH
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as lang
from szeyapapi.utils.normalization import sl_normalization

_sl_audio_index: dict | None = None


def load_sl_audio_index() -> dict:
    with open(STEPHEN_LI_DICTIONARY_PATH, encoding="utf-8") as f:
        entries = json.load(f)

    index = {}
    for entry in entries:
        url = entry.get("taishaneseAudio")
        if not url:
            continue

        # Run through the same normalization as stephenli_dictionary.py
        raw = entry.get("taishaneseRomanization", "")
        penyim_string = sl_normalization(raw)

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
