import json
import logging
import os

from szeyapapi.config import GENE_CHIN_DICTIONARY_PATH, PROJ_ROOT
from szeyapapi.dictionaries.dictionary_base import DictionaryBase
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as lang


class GeneChinDictionary(DictionaryBase):
    def __init__(self, name, src_url):
        super().__init__(name)
        self.penyim_lang_type = lang.GC
        self.src_url = src_url

    def load_dictionary(self):
        with open(os.path.join(PROJ_ROOT, GENE_CHIN_DICTIONARY_PATH), "r") as file:
            self.dictionary = json.load(file)

        # remove header if exists
        if self.dictionary[0]["PENYIM"] == "GPS":
            self.dictionary = self.dictionary[1:]

        # A definition can be parsed into a list of possible translations
        # We ensure all are in a list format
        for entry in self.dictionary:
            keys_need_join = ("TRAD", "SIMP", "PENYIM", "PINYIN", "LEMMA")
            for key in keys_need_join:
                if (key in entry) and (isinstance(entry[key], str)):
                    if key != "LEMMA":
                        value = [entry.get(key, "")]
                    else:
                        value = entry.get(key, "")

                    entry.update({key: value})

        for i, entry in enumerate(self.dictionary):
            parsed_penyim = []
            for word in entry["PENYIM"]:
                if word:
                    try:
                        penyim_obj = Penyim(word, lang.GC)
                        parsed_penyim.append(penyim_obj)
                    except ValueError as e:
                        logging.debug(
                            f"Warning: Failed to parse penyim '{word}' at entry {i}: {e}"
                        )
                        parsed_penyim.append(None)
                else:
                    parsed_penyim.append(None)
            entry["PENYIM"] = parsed_penyim


# Singleton instance of GeneChinDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
GC = GeneChinDictionary("Gene Chin", "https://www.chinfamilytree.com/hed/")
GC.load_dictionary()
