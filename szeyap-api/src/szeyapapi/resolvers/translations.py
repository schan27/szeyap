from ..translation_logic.translator import Translator
from ..translation_logic.question import TranslationQuestion

from ..dictionaries.genechin_dictionary import GC
from ..dictionaries.stephenli_dictionary import SL

gc_translator = Translator("Gene Chin Translator", GC)
sl_translator = Translator("Stephen Li Translator", SL)


def hello_world():
    return "Hello, World!"


def get(phrase: str, dictionary: str, penyim: bool, limit=10):
    # construct Question using phrase
    q = TranslationQuestion(phrase)
    if dictionary == "GC_DICT" or dictionary == "ALL_DICT":
        gc_responses = gc_translator.ask(q, limit, penyim).as_api_resp()
        for item in gc_responses["translations"]:
            item["source"] = "Gene Chin"

    if dictionary == "SL_DICT" or dictionary == "ALL_DICT":
        sl_responses = sl_translator.ask(q, limit, penyim).as_api_resp()
        for item in sl_responses["translations"]:
            item["source"] = "Stephen Li"

    if dictionary == "ALL_DICT":
        responses = dict(
            original_phrase=gc_responses["original_phrase"],
            detected_language=gc_responses["detected_language"],
            translations=sl_responses["translations"] \
                + gc_responses["translations"],
        )
    elif dictionary == "GC_DICT":
        responses = gc_responses
    else:
        responses = sl_responses
        
    return responses
