import json
import os
from ..config import PROJ_ROOT

from ..processesing.comparison import LANG_MODEL

# A base class for all dictionaries
# Dictionary classes are designed to be used as a singleton, 
# meaning they are instantiated once and used throughout the program

# Dictionaries LOAD and ADAPT
#  - Dictionaries are extended from Dictionary Base and implement **loading** and **adapting** of the data in its raw format to a standardized format that can used by the Translator
#  - like 3D printer filament, the colour may be different but how we use it (the functionality) is the same

# The dictionary is loaded in from a JSON file, which is 
# a list of objects with the following format:
# {
#   "TRAD": "你好",
#   "SIMP": "你好",
#   "JYUTPING": Jyutping("ni33 hao35"),
#   "PENYIM": ni hao",
#   "DEFN": hello",
# }
class DictionaryBase():

  def __init__(self, name):
    self.dictionary: list[dict] = []
    self.name = name
    self.type = None

  def load_json(self, path):
    with open(os.path.join(PROJ_ROOT, path), 'r') as file:
      self.dictionary = json.load(file)