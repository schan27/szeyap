import re

import langid
import spacy
from hanziconv import HanziConv
from wordfreq import zipf_frequency

from szeyapapi.dictionaries.dictionary_base import DictionaryBase
from szeyapapi.translation_logic.penyim import Penyim
from szeyapapi.translation_logic.question import TranslationQuestion
from szeyapapi.translation_logic.response import Response
from szeyapapi.translation_logic import orthography
from szeyapapi.utils.enums import PenyimFormats, SearchLanguage

# A Translator receives Questions and create Responses
#  - the Translator is created by giving it a dictionary, and it uses the dictionary to create Responses
#  - like 3D printer, it takes in different colour filaments (different dictionaries) and prints designs (response objects)

langid.set_languages(["en", "zh"])
CHINESE_LANGS = {
    SearchLanguage.MANDARIN.value,
    SearchLanguage.CANTONESE.value,
    SearchLanguage.TAISHANESE.value,
}


class Translator:
    nlp = spacy.load("en_core_web_sm")

    def __init__(self, name: str, dictionary: DictionaryBase):
        self.name: str = name
        self.data: DictionaryBase = dictionary

    def _search_dictionary(self, phrase: str, field: str, full_match: bool = True):
        """English search"""
        parsed = self.nlp(phrase)
        lemmatized_phrase = " ".join([tok.lemma_ for tok in parsed])

        def _search_match_fn(x):
            if full_match:
                return (
                    re.search(rf"\b{lemmatized_phrase.lower()}\b", x[field].lower())
                    is not None
                )
            return lemmatized_phrase.lower() in x[field].lower()

        return filter(_search_match_fn, self.data.dictionary)

    def _search_dictionary_by_penyim(self, penyim: Penyim) -> Response:
        """Penyim search"""

        def _search_match_fn(x):
            return any(
                penyim == dict_entry_penyim and dict_entry_penyim is not None
                for dict_entry_penyim in x["PENYIM"]
            )

        return filter(_search_match_fn, self.data.dictionary)

    def _search_dictionary_by_chinese(self, phrase: str, language: str) -> Response:
        """Chinese search"""

        def _search_match_fn(x):
            for simp in x[language]:
                if simp and HanziConv.toSimplified(phrase) in simp:
                    return True

        return filter(_search_match_fn, self.data.dictionary)

    def _construct_answer(
        self, q: TranslationQuestion, answers: list, limit: int
    ) -> Response:
        response = Response(q)
        response.add_metadata("dictionary_name", self.data.name)
        response.add_metadata("dictionary_url", self.data.src_url)

        def construct_translation(i, defn):
            penyim_api_response = []
            for j, parsed_penyim in enumerate(defn["PENYIM"]):
                if parsed_penyim and parsed_penyim.has_errors():
                    response.errors.append(
                        f"#{i}: penyim[{j}] - {parsed_penyim.summarize_errors()}"
                    )
                penyim_api_response.append(
                    parsed_penyim.as_dict() if parsed_penyim else None
                )
            
            forms = orthography.add_missing_hanzi_form(defn)
            simp = forms["SIMP"]
            trad = forms["TRAD"]

            return {
                "english": defn["DEFN"],
                "chinese": {
                    "simplified": simp,
                    "traditional": trad,
                    "penyim": penyim_api_response,
                },
                "taishanese": defn[SearchLanguage.TAISHANESE.value],
                "cantonese": defn[SearchLanguage.CANTONESE.value],
                "mandarin": defn[SearchLanguage.MANDARIN.value],
            }

        if not answers:
            return response

        answers = self.rank_by_frequency(answers)

        for i, defn in enumerate(answers):
            response.add_answer(construct_translation(i, defn))
            if len(response.answers) == limit:
                break
        return response

    # based on the src language format, we search the dictionaries accordingly
    # Search algorithm is simple here, just iterate the dictionary and search for
    # matching string
    def ask(
        self,
        q: TranslationQuestion,
        limit: int,
        penyim: bool = False,
        language: str = None,
    ) -> Response:
        answers = None
        if penyim:
            answers = self._search_dictionary_by_penyim(
                Penyim(q.query, PenyimFormats.UNK)
            )
        else:
            if (language == SearchLanguage.UNK.value) or (language is None):
                detected_lang = langid.classify(q.query)[0]
            else:
                detected_lang = language

            q.lang = detected_lang
            if detected_lang in CHINESE_LANGS:
                answers = self._search_dictionary_by_chinese(
                    q.query, language=detected_lang
                )
            elif detected_lang == SearchLanguage.ENGLISH.value:
                answers = self._search_dictionary(q.query, "LEMMA", full_match=True)

        if answers is None:
            raise ValueError(
                "Could not determine if query is English, Chinese, or Penyim."
            )
        return self._construct_answer(q, answers, limit)

    @staticmethod
    def rank_by_frequency(results: list[dict]):
        ranked_results = []
        for result in results:
            word = result["SIMP"][0]
            score = zipf_frequency(word, "zh")
            ranked_results.append((result, score))

        ranked_results.sort(key=lambda item: item[1], reverse=True)
        return [item[0] for item in ranked_results]
