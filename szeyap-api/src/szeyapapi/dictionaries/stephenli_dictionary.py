from .dictionary_base import DictionaryBase
from ..config import STEPHEN_LI_DICTIONARY_PATH
from ..utils.enums import LanguageFormats as lang

import os

FILE_DIR = os.path.dirname(os.path.realpath(__file__))

class StephenLiDictionary(DictionaryBase):

    def __init__(self, name, src_url):
        super().__init__(name)
        self.jyutping_lang_type = lang.SL
        self.src_url = src_url

    def load_dictionary(self):
        self.load_json(STEPHEN_LI_DICTIONARY_PATH)
        self.dictionary = map(lambda x: {
            "SIMP": [x["taishanese"]],
            "TRAD": [None],  # we just group everything as simplified for stephen li
            "JYUTPING": [x["taishaneseRomanization"].replace('[', '').replace(']', '')],
            "PENYIM": [None],
            "DEFN": x["english"]
        }, self.dictionary)


# Singleton instance of StephenLiDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
SL = StephenLiDictionary("Stephen Li", "https://www.taishandict.com")
SL.load_dictionary()