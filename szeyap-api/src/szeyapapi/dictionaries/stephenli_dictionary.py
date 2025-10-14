from szeyapapi.dictionaries.dictionary_base import DictionaryBase
from szeyapapi.config import STEPHEN_LI_DICTIONARY_PATH
from szeyapapi.utils.enums import LanguageFormats as lang
from szeyapapi.translation_logic.penyim import Penyim

import os

FILE_DIR = os.path.dirname(os.path.realpath(__file__))

class StephenLiDictionary(DictionaryBase):

    def __init__(self, name, src_url):
        super().__init__(name)
        self.penyim_lang_type = lang.SL
        self.src_url = src_url

    def load_dictionary(self):
        self.load_json(STEPHEN_LI_DICTIONARY_PATH)
        
        def safe_transform(x):
            try:
                penyim_string = x["taishaneseRomanization"].replace('[', '').replace(']', '')

                splitted = penyim_string.split("/")
                splitted = [s.strip() for s in splitted if not s.isdigit()]
                penyim_string = " ".join(splitted)

                return {
                    "SIMP": [x["mandarin"]],
                    "TRAD": None,  # we just group everything as simplified for stephen li
                    "PENYIM": [Penyim(penyim_string, lang.SL)],
                    "DEFN": x["english"]        
                }
            except:
                pass
        
        self.dictionary = [item for item in map(safe_transform, self.dictionary) if item is not None]


# Singleton instance of StephenLiDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
SL = StephenLiDictionary("Stephen Li", "https://www.taishandict.com")
SL.load_dictionary()