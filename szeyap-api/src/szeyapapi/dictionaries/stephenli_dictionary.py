import os
from collections import ChainMap

from szeyapapi.config import STEPHEN_LI_DICTIONARY_PATH
from szeyapapi.dictionaries.dictionary_base import DictionaryBase
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as lang
from szeyapapi.utils.normalization import sl_normalization

FILE_DIR = os.path.dirname(os.path.realpath(__file__))


class StephenLiDictionary(DictionaryBase):
    def __init__(self, name, src_url):
        super().__init__(name)
        self.penyim_lang_type = lang.SL
        self.src_url = src_url

    def load_dictionary(self):
        self.load_json(STEPHEN_LI_DICTIONARY_PATH)

        def safe_transform(dict_entry: dict[str, str]):
            try:
                raw = dict_entry["taishaneseRomanization"]
                penyim_string = sl_normalization(raw)
                penyim = Penyim(penyim_string, lang.SL)

                audio_index = None
                audio_url = dict_entry.get("taishaneseAudio")
                audio_index = {}
                if audio_url:
                    sl_romanization = penyim.as_dict().get(lang.SL, "")
                    for key in ("taishanese", "cantonese", "mandarin"):
                        val = dict_entry.get(key)
                        if val:
                            audio_index[(val, sl_romanization)] = audio_url

                dictionary_entry = {
                    "SIMP": [dict_entry["mandarin"]],
                    "TRAD": None,  # we just group everything as simplified for stephen li
                    "PENYIM": [penyim],
                    "DEFN": dict_entry["english"],
                    "LEMMA": dict_entry["LEMMA"],
                }

                # audio_index = {key: audio_url}
                return (dictionary_entry, audio_index)
            except Exception:
                return (None, None)

        result = [
            (entry, index)
            for (entry, index) in map(safe_transform, self.dictionary)
            if entry is not None
        ]
        self.dictionary, audio_index_list = zip(*result)
        # convert list of mappings into one
        self.audio_index = dict(ChainMap(*audio_index_list))


# Singleton instance of StephenLiDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
SL = StephenLiDictionary("Stephen Li", "https://www.taishandict.com")
SL.load_dictionary()
