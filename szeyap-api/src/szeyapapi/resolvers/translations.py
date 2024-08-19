from ..utils.enums import LanguageFormats as Lang
from ..translation_logic.translator import Translator
from ..translation_logic.question import TranslationQuestion

from ..dictionaries.genechin_dictionary import GC
from ..dictionaries.stephenli_dictionary import SL

gc_translator = Translator("Gene Chin Translator", GC)
sl_translator = Translator("Stephen Li Translator", SL)

def hello_world():
    return "Hello, World!"

def get(phrase: str, src_lang: str, limit=10):
    # construct Question using phrase
    q = TranslationQuestion(phrase, Lang[src_lang])

    responses = gc_translator.ask(q, limit)
    return responses.as_api_resp()
