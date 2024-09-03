from ..utils.enums import LanguageFormats as Lang
from ..translation_logic.jyutping import Jyutping


def get(phrase: str, src_lang: str):
    # construct Jyutping Object using phrase as sample
    jyutping = Jyutping(phrase, Lang[src_lang])

    return jyutping.as_dict()
