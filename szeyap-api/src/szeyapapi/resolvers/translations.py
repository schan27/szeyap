from ..dictionaries.genechin_dictionary import GC
from ..dictionaries.stephenli_dictionary import SL
from ..translation_logic.question import TranslationQuestion
from ..translation_logic.translator import Translator
from .pronunciations import attach_pronunciation


def hello_world():
    return "Hello, World!"


def get_translator(dictionary: str):
    if dictionary == "GC_DICT":
        return Translator("Gene Chin Translator", GC)
    elif dictionary == "SL_DICT":
        return Translator("Stephen Li Translator", SL)
    return None


def get_source(dictionary: str):
    if dictionary == "GC_DICT":
        return "Gene Chin"
    elif dictionary == "SL_DICT":
        return "Stephen Li"
    return None


def process_translation_question(
    dictionary: str,
    q: TranslationQuestion,
    limit: int,
    penyim: bool,
    language: str = None,
):
    translator = get_translator(dictionary)
    responses = translator.ask(q, limit, penyim, language).as_api_resp()

    for item in responses["translations"]:
        item["source"] = get_source(dictionary)
        item.setdefault("pronunciation_id", None)
        item.setdefault("pronunciation_url", None)

    try:
        attach_pronunciation(responses["translations"], dictionary)
    except Exception:
        print(f'Could not attach pronunciation for {responses["translations"]=}')

    return responses


def get(phrase: str, dictionary: str, penyim: bool, language: str, limit=10):
    # construct Question using phrase
    q = TranslationQuestion(phrase)
    search_params = dict(q=q, limit=limit, penyim=penyim, language=language)

    if dictionary == "GC_DICT" or dictionary == "ALL_DICT":
        # NOTE: GC audio links are not yet available — pronunciation_url will
        # be None for all GC items until the index is populated.
        gc_responses = process_translation_question(
            dictionary="GC_DICT", **search_params
        )

    if dictionary == "SL_DICT" or dictionary == "ALL_DICT":
        sl_responses = process_translation_question(
            dictionary="SL_DICT", **search_params
        )

    if dictionary == "ALL_DICT":
        responses = dict(
            original_phrase=gc_responses["original_phrase"],
            detected_language=gc_responses["detected_language"],
            translations=sl_responses["translations"] + gc_responses["translations"],
        )
    elif dictionary == "GC_DICT":
        responses = gc_responses
    elif dictionary == "SL_DICT":
        responses = sl_responses
    else:
        responses = None

    return responses
