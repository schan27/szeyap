from pathlib import Path 

import pandas as pd 
from unidecode import unidecode

from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as Lang


current_dir = Path(__file__).resolve().parent
penyim_data_path = Path(
    current_dir, "..", 
    "src/szeyapapi/data/initials_finals.xlsx")

df = pd.read_excel(penyim_data_path, sheet_name=None, index_col=0)

### Gene Chin ###
def test_gc_no_initial():
    test = "ō"
    result = Penyim(test, Lang.GC)
    assert unidecode(result.formats[0][Lang.GC]) == unidecode("ō")


def test_gc_syllable():
    test = "dā"
    result = Penyim(test, Lang.GC)
    assert unidecode(result.formats[0][Lang.GC]) == unidecode("dā")


### Stephen Li ###
def test_sc_phrase():
    test = 'vi32 saŋ33 dzi55'
    result = Penyim(test, Lang.SL)

    expected_result = ["vi32", "saŋ33", "dzi55"]
    for i, word_formats in enumerate(result.formats):
        assert unidecode(word_formats[Lang.SL]) == unidecode(expected_result[i])


def test_basic_no_tone():
    test = 'ni'
    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("n(e)i")
    assert unidecode(result.formats[0][Lang.GC]) == unidecode("ni")
    assert unidecode(result.formats[0][Lang.SL]) == unidecode("ni")
    assert unidecode(result.formats[0][Lang.DJ]) == unidecode("n(e)i")
    assert unidecode(result.formats[0][Lang.JW]) == unidecode("n(e)i")


def test_no_space():
    test = "neihau"

    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("n(e)i")
    assert unidecode(result.formats[1][Lang.HSR]) == unidecode("hau")


def test_cei():
    test = "cei ao"

    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("tsi")
    assert unidecode(result.formats[1][Lang.HSR]) == unidecode("au")


def test_lh_reversal():
    test = "hlam1"

    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("lham33")
