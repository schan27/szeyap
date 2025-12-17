# TODO: All the tests are being compared against the parsed result for HSR, we should also test for the other systems
from pathlib import Path
from unicodedata import normalize

import pandas as pd
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import LanguageFormats as Lang
from unidecode import unidecode

current_dir = Path(__file__).resolve().parent
penyim_data_path = Path(current_dir, "..", "src/szeyapapi/data/initials_finals.xlsx")

df = pd.read_excel(penyim_data_path, sheet_name=None, index_col=0)


def test_gc_no_initial():
    test = "ō"
    result = Penyim(test, Lang.GC)
    assert normalize("NFD", result.formats[0][Lang.GC]) == normalize("NFD", "ō")


def test_gc_syllable():
    test = "dā"
    result = Penyim(test, Lang.GC)
    assert normalize("NFD", result.formats[0][Lang.GC]) == normalize("NFD", "dā")


def test_sc_phrase():
    test = "vi32 saŋ33 dzi55"
    result = Penyim(test, Lang.SL)
    expected_result = ["vi32", "saŋ33", "dzi55"]
    for i, word_formats in enumerate(result.formats):
        assert unidecode(word_formats[Lang.SL]) == unidecode(expected_result[i])


def test_basic_no_tone():
    test = "ni"
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


def test_mix_romanization_tone():
    test = "xel33"

    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("lhiau33")


def test_diacritic_markers():
    test1 = "chïäo"
    test2 = "chïao33"

    result1 = Penyim(test1, Lang.UNK)
    result2 = Penyim(test2, Lang.UNK)

    assert unidecode(result1.formats[0][Lang.HSR]) == unidecode("tsi33")
    assert unidecode(result1.formats[1][Lang.HSR]) == unidecode("au33")
    assert unidecode(result2.formats[0][Lang.HSR]) == unidecode("tsi33")
    assert unidecode(result2.formats[1][Lang.HSR]) == unidecode("au33")


# def test_double_tone():
#     test = "hao-’"
#     result = Penyim(test, Lang.UNK)
#     assert unidecode(result.formats[0][Lang.HSR]) == unidecode("hau553")


def test_bracket_input():
    test1 = "d(e)i"
    test2 = "c(h)a"
    result1 = Penyim(test1, Lang.UNK)
    result2 = Penyim(test2, Lang.UNK)
    assert unidecode(result1.formats[0][Lang.HSR]) == unidecode("d(e)i")
    assert unidecode(result2.formats[0][Lang.HSR]) == unidecode("tsa")


def test_unknown_term():
    test = "nai5fuk215"
    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("nai21")
    assert unidecode(result.formats[1][Lang.HSR]) == unidecode("fuk215")


def test_ng_reversal():
    test = "gno"
    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("ngo")


def test_variants():
    test1 = "sha"
    result1 = Penyim(test1, Lang.UNK)
    assert unidecode(result1.formats[0][Lang.HSR]) == unidecode("sa")

    test2 = "chee"
    result2 = Penyim(test2, Lang.UNK)
    assert unidecode(result2.formats[0][Lang.HSR]) == unidecode("tsi")

    test3 = "wa"
    result3 = Penyim(test3, Lang.UNK)
    assert unidecode(result3.formats[0][Lang.HSR]) == unidecode("va")


def test_ambiguous_results():
    # ɛɪn (SL) and -ein (GC) is more common
    test1 = "ben"
    result1 = Penyim(test1, Lang.UNK)
    assert unidecode(result1.formats[0][Lang.SL]) == unidecode("bɛɪn")
    assert unidecode(result1.formats[0][Lang.GC]) == unidecode("bein")

    # -ɛt (SL) and -eik (GC) are more common
    test2 = "set"
    result2 = Penyim(test2, Lang.UNK)
    assert unidecode(result2.formats[0][Lang.SL]) == unidecode("sɛt")
    assert unidecode(result2.formats[0][Lang.GC]) == unidecode("seik")


def test_labial_onglide_inclusion():
    test1 = "muo"
    result1 = Penyim(test1, Lang.UNK)
    assert unidecode(result1.formats[0][Lang.HSR]) == unidecode("muo")

    test2 = "nguoi"
    result2 = Penyim(test2, Lang.UNK)
    assert unidecode(result2.formats[0][Lang.HSR]) == unidecode("ngoi")

    test3 = "uon"
    result3 = Penyim(test3, Lang.UNK)
    assert unidecode(result3.formats[0][Lang.HSR]) == unidecode("on")

    test4 = "huot"
    result4 = Penyim(test4, Lang.UNK)
    assert unidecode(result4.formats[0][Lang.HSR]) == unidecode("hot")


# def test_multiple_romanizations():
#     test = "ngi sib xei"
#     result = Penyim(test, Lang.UNK)
#     expected_result = ["ng(e)i", "sip", "lh(e)i"]
#     for i, word_formats in enumerate(result.formats):
#         assert unidecode(word_formats[Lang.HSR]) == unidecode(expected_result[i])


def test_missing_final_tone():
    test = "fān-uï"
    result = Penyim(test, Lang.UNK)
    assert unidecode(result.formats[0][Lang.HSR]) == unidecode("fan55")
    assert unidecode(result.formats[1][Lang.HSR]) == unidecode("ui33")


def test_nan_segment():
    test = "nãn-häm"
    result = Penyim(test, Lang.GC)
    assert unidecode(result.formats[0][Lang.GC]) == unidecode("nãn")
    assert unidecode(result.formats[1][Lang.GC]) == unidecode("häm")
