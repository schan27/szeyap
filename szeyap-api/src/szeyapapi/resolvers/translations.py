from ..dictionaries.genechin_dictionary import GC
from ..dictionaries.stephenli_dictionary import SL
from ..translation_logic.question import TranslationQuestion
from ..translation_logic.translator import Translator
from .pronunciations import attach_pronunciation

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
            translations=sl_responses["translations"] + gc_responses["translations"],
        )
    elif dictionary == "GC_DICT":
        responses = gc_responses
    else:
        responses = sl_responses

    return responses
    # q = TranslationQuestion(phrase, Lang[src_lang])
    
    # translator = gc_translator if dictionary == "GC_DICT" else sl_translator

    # responses = translator.ask(q, limit)
    # api_resp = responses.as_api_resp()

    # api_resp["translations"] = attach_pronunciation(api_resp["translations"], dictionary) # Jackson: If this is too coupled
    # # we can move it elsewhere but for now we expect one pronunciation per translation
    
    # return api_resp

    # # responses = gc_translator.ask(q, limit) if dictionary == "GC_DICT" else sl_translator.ask(q, limit)

    # # return responses.as_api_resp()
