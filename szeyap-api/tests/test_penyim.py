# TODO: All the tests are being compared against the parsed result for HSR, we should also test for the other systems
from unicodedata import normalize

from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.utils.enums import PenyimFormats
from unidecode import unidecode


def test_gc_no_initial():
    test = "ō"
    result = Penyim(test, PenyimFormats.GC)
    assert normalize("NFD", result.formats[0][PenyimFormats.GC]) == normalize(
        "NFD", "ō"
    )


def test_gc_syllable():
    test = "dā"
    result = Penyim(test, PenyimFormats.GC)
    assert normalize("NFD", result.formats[0][PenyimFormats.GC]) == normalize(
        "NFD", "dā"
    )


def test_sc_phrase():
    test = "vi32 saŋ33 dzi55"
    result = Penyim(test, PenyimFormats.SL)
    expected_result = ["vi32", "saŋ33", "dzi55"]
    for i, word_formats in enumerate(result.formats):
        assert unidecode(word_formats[PenyimFormats.SL]) == unidecode(
            expected_result[i]
        )


def test_basic_no_tone():
    test = "ni"
    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("n(e)i")
    assert unidecode(result.formats[0][PenyimFormats.GC]) == unidecode("ni")
    assert unidecode(result.formats[0][PenyimFormats.SL]) == unidecode("ni")
    assert unidecode(result.formats[0][PenyimFormats.DJ]) == unidecode("n(e)i")
    assert unidecode(result.formats[0][PenyimFormats.JW]) == unidecode("n(e)i")


def test_no_space():
    test = "neihau"

    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("n(e)i")
    assert unidecode(result.formats[1][PenyimFormats.HSR]) == unidecode("hau")


def test_cei():
    test = "cei ao"
    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("tsi")
    assert unidecode(result.formats[1][PenyimFormats.HSR]) == unidecode("au")


def test_lh_reversal():
    test = "hlam1"

    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("lham33")


def test_mix_romanization_tone():
    test = "xel33"

    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("lhiau33")


def test_diacritic_markers():
    test1 = "chïäo"
    test2 = "chïao33"

    result1 = Penyim(test1, PenyimFormats.UNK)
    result2 = Penyim(test2, PenyimFormats.UNK)

    assert unidecode(result1.formats[0][PenyimFormats.HSR]) == unidecode("tsi33")
    assert unidecode(result1.formats[1][PenyimFormats.HSR]) == unidecode("au33")
    assert unidecode(result2.formats[0][PenyimFormats.HSR]) == unidecode("tsi33")
    assert unidecode(result2.formats[1][PenyimFormats.HSR]) == unidecode("au33")


# def test_double_tone():
#     test = "hao-’"
#     result = Penyim(test, PenyimFormats.UNK)
#     assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("hau553")


def test_bracket_input():
    test1 = "d(e)i"
    test2 = "c(h)a"
    result1 = Penyim(test1, PenyimFormats.UNK)
    result2 = Penyim(test2, PenyimFormats.UNK)
    assert unidecode(result1.formats[0][PenyimFormats.HSR]) == unidecode("d(e)i")
    assert unidecode(result2.formats[0][PenyimFormats.HSR]) == unidecode("tsa")


def test_unknown_term():
    test = "nai5fuk215"
    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("nai21")
    assert unidecode(result.formats[1][PenyimFormats.HSR]) == unidecode("fuk215")


def test_ng_reversal():
    test = "gno"
    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("ngo")


def test_variants():
    test1 = "sha"
    result1 = Penyim(test1, PenyimFormats.UNK)
    assert unidecode(result1.formats[0][PenyimFormats.HSR]) == unidecode("sa")

    test2 = "chee"
    result2 = Penyim(test2, PenyimFormats.UNK)
    assert unidecode(result2.formats[0][PenyimFormats.HSR]) == unidecode("tsi")

    test3 = "wa"
    result3 = Penyim(test3, PenyimFormats.UNK)
    assert unidecode(result3.formats[0][PenyimFormats.HSR]) == unidecode("va")


def test_ambiguous_results():
    # ɛɪn (SL) and -ein (GC) is more common
    # test1 = "ben"
    # result1 = Penyim(test1, PenyimFormats.UNK)
    # assert unidecode(result1.formats[0][PenyimFormats.SL]) == unidecode("bɛɪn")
    # assert unidecode(result1.formats[0][PenyimFormats.GC]) == unidecode("bein")

    # -ɛt (SL) and -eik (GC) are more common
    test2 = "set"
    result2 = Penyim(test2, PenyimFormats.UNK)
    assert unidecode(result2.formats[0][PenyimFormats.SL]) == unidecode("sɛt")
    assert unidecode(result2.formats[0][PenyimFormats.GC]) == unidecode("seik")


def test_labial_onglide_inclusion():
    test1 = "muo"
    result1 = Penyim(test1, PenyimFormats.UNK)
    assert unidecode(result1.formats[0][PenyimFormats.HSR]) == unidecode("mo")

    test2 = "nguoi"
    result2 = Penyim(test2, PenyimFormats.UNK)
    assert unidecode(result2.formats[0][PenyimFormats.HSR]) == unidecode("ngoi")

    test3 = "uon"
    result3 = Penyim(test3, PenyimFormats.UNK)
    assert unidecode(result3.formats[0][PenyimFormats.HSR]) == unidecode("on")

    test4 = "huot"
    result4 = Penyim(test4, PenyimFormats.UNK)
    assert unidecode(result4.formats[0][PenyimFormats.HSR]) == unidecode("hot")


# def test_multiple_romanizations():
#     test = "ngi sib xei"
#     result = Penyim(test, PenyimFormats.UNK)
#     expected_result = ["ng(e)i", "sip", "lh(e)i"]
#     for i, word_formats in enumerate(result.formats):
#         assert unidecode(word_formats[PenyimFormats.HSR]) == unidecode(expected_result[i])


def test_missing_final_tone():
    test = "fān-uï"
    result = Penyim(test, PenyimFormats.UNK)
    assert unidecode(result.formats[0][PenyimFormats.HSR]) == unidecode("fan55")
    assert unidecode(result.formats[1][PenyimFormats.HSR]) == unidecode("ui33")


def test_nan_segment():
    test = "nãn-häm"
    result = Penyim(test, PenyimFormats.GC)
    assert unidecode(result.formats[0][PenyimFormats.GC]) == unidecode("nãn")
    assert unidecode(result.formats[1][PenyimFormats.GC]) == unidecode("häm")


def test_sl_apple():
    test = "pɛɪn22 gɔ55"
    result = Penyim(test, PenyimFormats.SL)
    assert unidecode(result.formats[0][PenyimFormats.SL]) == unidecode("pɛɪn22")
    assert unidecode(result.formats[1][PenyimFormats.SL]) == unidecode("gɔ55")
