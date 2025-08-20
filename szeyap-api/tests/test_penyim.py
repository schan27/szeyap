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
    assert unidecode(result.formats[0][Lang.SL]) == unidecode