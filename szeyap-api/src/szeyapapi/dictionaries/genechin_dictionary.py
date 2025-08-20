from szeyapapi.dictionaries.dictionary_base import DictionaryBase
from szeyapapi.config import GENE_CHIN_DICTIONARY_PATH, PROJ_ROOT
from szeyapapi.utils.enums import LanguageFormats as lang
from szeyapapi.translation_logic.penyim import Penyim

import json
import os 

class GeneChinDictionary(DictionaryBase):

  def __init__(self, name, src_url):
    super().__init__(name)
    self.penyim_lang_type = lang.GC
    self.src_url = src_url
  
  def load_dictionary(self):
    with open(os.path.join(PROJ_ROOT, GENE_CHIN_DICTIONARY_PATH), 'r') as file:
      self.dictionary = json.load(file)
    
    # remove header if exists
    if self.dictionary[0]['JYUTPING'] == 'GPS':
      self.dictionary = self.dictionary[1:]
    
    # A definition can be parsed into a list of possible translations
    # We ensure all are in a list format
    for entry in self.dictionary:
      keys_need_join = ('TRAD', 'SIMP', 'PENYIM', 'JYUTPING')
      for key in keys_need_join:
        if isinstance(entry[key], str):
          entry.update({
            key: [entry[key]]
          })

    # Adjust Jyutping format to allow for parsing
    for i, entry in enumerate(self.dictionary):
      parsed_penyim = [Penyim(word.replace("-", " "), lang.GC) if word 
                  else None for word in entry["PENYIM"]]
      entry["PENYIM"] = parsed_penyim


# Singleton instance of GeneChinDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
GC = GeneChinDictionary("Gene Chin", "https://www.chinfamilytree.com/hed/")
GC.load_dictionary()

