from ..translation_logic.penyim import Penyim
from ..utils.enums import PenyimFormats


def get(phrase: str, penyim_format: str = "UNK"):
    # construct Jyutping Object using phrase as sample
    penyim = Penyim(phrase, PenyimFormats[penyim_format])

    return penyim.as_dict()
