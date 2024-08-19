from .dictionary_base import DictionaryBase
from ..config import STEPHEN_LI_DICTIONARY_PATH
import os

FILE_DIR = os.path.dirname(os.path.realpath(__file__))

class StephenLiDictionary(DictionaryBase):

    def __init__(self, name):
        super().__init__(name)

    def load_dictionary(self):
        self.load_json(STEPHEN_LI_DICTIONARY_PATH)


# Singleton instance of StephenLiDictionary
# This is the instance that should be used throughout the program
# import this instance in other files to use the dictionary
SL = StephenLiDictionary("Stephen Li")
SL.load_dictionary()