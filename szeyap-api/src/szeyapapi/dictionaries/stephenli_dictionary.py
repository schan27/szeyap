from .dictionary_base import DictionaryBase
from ..config import PROJ_ROOT, STEPHEN_LI_DICTIONARY_PATH, STEPHEN_LI_EN_EMBEDDINGS_PATH, STEPHEN_LI_CH_EMBEDDINGS_PATH
from ..utils.enums import LanguageFormats as lang
from ..translation_logic.jyutping import Jyutping
import logging
logger = logging.getLogger("szeyapapi")

import os
import torch

FILE_DIR = os.path.dirname(os.path.realpath(__file__))

class StephenLiDictionary(DictionaryBase):

    def __init__(self, name, src_url):
        super().__init__(name)
        self.jyutping_lang_type = lang.SL
        self.src_url = src_url

    def load_dictionary(self):
        self.load_json(STEPHEN_LI_DICTIONARY_PATH)
        self.dictionary = list(map(lambda x: {
            "SIMP": [x["taishanese"]],
            "TRAD": [None],  # we just group everything as simplified for stephen li
            "JYUTPING": [Jyutping(x["taishaneseRomanization"].replace('[', '').replace(']', ''), lang.SL)],
            "PENYIM": [None],
            "DEFN": x["english"]
        }, self.dictionary))

    def load_embeddings(self):
        logger.info("Loading SL embeddings")
        self.en_embeddings = torch.load(os.path.join(PROJ_ROOT, STEPHEN_LI_EN_EMBEDDINGS_PATH))
        self.ch_embeddings = torch.load(os.path.join(PROJ_ROOT, STEPHEN_LI_CH_EMBEDDINGS_PATH))

# Singleton instance of StephenLiDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
SL = StephenLiDictionary("Stephen Li", "https://www.taishandict.com")