import re
from ..utils.enums import LanguageFormats as lang
from typing import List
from .response import Response
from .question import TranslationQuestion
from ..dictionaries.dictionary_base import DictionaryBase
from .jyutping import Jyutping

from ..processesing.comparison import LANG_MODEL
import torch

# A Translator receives Questions and create Responses
#  - the Translator is created by giving it a dictionary, and it uses the dictionary to create Responses
#  - like 3D printer, it takes in different colour filaments (different dictionaries) and prints designs (response objects)

class Translator:

    ENGLISH_MATCH_REGEX = r"^[a-zA-Z0-9\s\.,\?]*$"
    CHINESE_MATCH_REGEX = r"[\u4e00-\u9fff]+(?=,|\s|$)"
    JYUTPING_MATCH_REGEX = r"[A-Za-z]+[1-9]{2,3}\b"

    def __init__(self, name: str, dictionary: DictionaryBase):
        self.name: str = name
        self.data: DictionaryBase = dictionary

    def _search_dictionary(self, phrase: str, field: str):

        def _search_match_fn(x):
            return phrase in x[field] or LANG_MODEL.compare_encoded(phrase_embedding, (x["EN_EMBEDDING"], x["CH_EMBEDDING"])) > 0.8
        def _calc_simularity(match) -> List:
            return LANG_MODEL.compare_encoded(phrase_embedding, (match["EN_EMBEDDING"], match["CH_EMBEDDING"]))
        
        phrase_embedding = LANG_MODEL.encode_data(phrase)
        return sorted(({"SIMILARITY": _calc_simularity(answer), **answer} for answer in filter(_search_match_fn, self.data.dictionary)), key=lambda x: x["SIMILARITY"], reverse=True)

    def _search_dictionary_w_embeddings(self, phrase):
        en_sim = LANG_MODEL.calc_simularities(phrase, self.data.en_embeddings)
        ch_sim = LANG_MODEL.calc_simularities(phrase, self.data.ch_embeddings)
        simularities = [(x + y) / 2 for x, y in zip(en_sim, ch_sim)]

        filter_sorted = sorted(({"SIMILARITY": simularities[i], **entry} for i, entry in enumerate(self.data.dictionary) if simularities[i] > 0.8 or phrase in entry["DEFN"]), key=lambda x: x["SIMILARITY"], reverse=True)
        return filter_sorted

    def _search_dictionary_by_jyutping(self, jyutping: Jyutping) -> Response:
        def _search_match_fn(x):
            return any(jyutping == j and j is not None for j in x["JYUTPING"])

        return [{"SIMILARITY": 1, **answer} for answer in filter(_search_match_fn, self.data.dictionary)]

    def _search_dictionary_by_chinese(self, ch_phrase: str) -> Response:
        def _search_match_fn(x):
            for trad in x["TRAD"]:
                if trad and ch_phrase in trad:
                    return True
            for simp in x["SIMP"]:
                if simp and ch_phrase in simp:
                    return True
        
        return [{"SIMILARITY": 1, **answer} for answer in filter(_search_match_fn, self.data.dictionary)]

    def _construct_answer(self, q: TranslationQuestion, answers: list, limit: int) -> Response:
        response = Response(q)
        response.add_metadata("dictionary_name", self.data.name)
        response.add_metadata("dictionary_url", self.data.src_url)
        
        def construct_translation(i, defn):
            jyut_as_api_resp = []
            for j, jyut in enumerate(defn["JYUTPING"]):
                if jyut and jyut.has_errors():
                    response.errors.append(f"#{i}: jyutping[{j}] - {jyut.summarize_errors()}")
                jyut_as_api_resp.append(jyut.as_dict() if jyut else None)
            
            return {
                "english": defn["DEFN"],
                "chinese": {
                    "traditional": defn["TRAD"],
                    "simplified": defn["SIMP"],
                    "penyim": defn["PENYIM"],
                    "jyutping": jyut_as_api_resp
                },
                "similarity": defn["SIMILARITY"]
            }

        if not answers:
            return response
        for i, defn in enumerate(answers):
            response.add_answer(construct_translation(i, defn))
            if len(response.answers) == limit:
                break
        return response

    # based on the src language format, we search the dictionaries accordingly
    # Search algorithm is simple here, just iterate the dictionary and search for 
    # matching string
    def ask(self, q: TranslationQuestion, limit: int) -> Response:

        if q.lang == lang.CH or re.match(self.CHINESE_MATCH_REGEX, q.query):
            answers = self._search_dictionary_by_chinese(q.query)
            return self._construct_answer(q, answers, limit)
        
        # we are trying to see if the query is a jyutping
        jyutping = Jyutping(q.query, q.lang)
        if not jyutping.has_errors():                
            answers = self._search_dictionary_by_jyutping(jyutping)
            return self._construct_answer(q, answers, limit)
        
        answers = self._search_dictionary_w_embeddings(q.query)
        return self._construct_answer(q, answers, limit)

    # def detect_language_format(self, sample: str):
    #     match_obj = re.search(self.JYUTPING_MATCH_REGEX, sample)
    #     if match_obj:
    #         # TODO: determine type of jyutping
    #         return lang.HSR

    #     match_obj = re.search(self.CHINESE_MATCH_REGEX, sample)
    #     if match_obj:
    #         return lang.CH

    #     match_obj = re.search(self.ENGLISH_MATCH_REGEX, sample)
    #     if match_obj:
    #         return lang.EN

    #     return lang.UNK
