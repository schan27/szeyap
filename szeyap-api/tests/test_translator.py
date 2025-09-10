import unittest
from pathlib import Path
from unittest.mock import patch

from szeyapapi.translation_logic.question import TranslationQuestion
from szeyapapi.translation_logic.translator import Translator
from szeyapapi.utils.enums import LanguageFormats as Lang


class TestSearch(unittest.TestCase):
    # see full test error
    maxDiff = None

    # don't know a better way to point at szeyap-api root
    current_dir = Path(__file__).resolve().parent
    dict_path = "test_dict.json"

    @patch("szeyapapi.config.GENE_CHIN_DICTIONARY_PATH", dict_path)
    @patch("szeyapapi.config.PROJ_ROOT", current_dir)
    def setUp(self):
        # not exactly sure why this works yet but smthng to do with import order:
        # https://www.reddit.com/r/learnpython/comments/lriqrq/how_to_mock_class_constants_imported_into_an/
        from szeyapapi.dictionaries.genechin_dictionary import GeneChinDictionary

        self.test_dict = GeneChinDictionary("Test Dictionary", "www.testurl.com")
        self.test_dict.load_dictionary()
        self.trans = Translator("Test Dictionary Translator", self.test_dict)

    def test_ask(self):
        question = TranslationQuestion("cats")
        res = self.trans.ask(question, 1).as_api_resp()
        expected_res = {
            "original_phrase": "cats",
            "detected_language": Lang.EN,
            "metadata": {
                "dictionary_name": "Test Dictionary",
                "dictionary_url": "www.testurl.com",
            },
            "translations": [
                {
                    "english": "cat.⁵",
                    "chinese": {
                        "penyim": [
                            {
                                Lang.DJ: "mao-",
                                Lang.GC: "māo",
                                Lang.HSR: "mau55",
                                Lang.JW: "mao2",
                                Lang.SL: "mau55",
                            }
                        ],
                        "traditional": ["\u8c93"],
                        "simplified": ["\u732b"],
                    },
                }
            ],
        }
        self.assertEqual(expected_res, res)

    def test_english_search(self):
        question = TranslationQuestion("cats")
        matches = list(
            self.trans._search_dictionary(question.query, "DEFN", full_match=True)
        )

        expected_matches = 2
        self.assertEqual(expected_matches, len(matches))

    def test_penyim_search(self):
        pass

    def test_chinese_search(self):
        pass
