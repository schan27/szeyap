import csv
import json
import szeyapapi.config as cfg
from ..utils.enums import LanguageFormats as Lang
from ..utils.enums import Tones as Tone
import os
from unicodedata import normalize

PROJECT_ROOT_PATH = os.path.join(os.path.dirname(__file__), "..")

class JyutpingTables:

    def __init__(self) -> None:
        self.initials = {}
        self.finals = {}
        self.tones = {}
        self.tables = {}

        self.load_tables()
        self.load_tones()

    def load_tables(self):
        # HSR
        self.tables[Lang.HSR] = self.read_table(cfg.HSR_JYUTPING_TABLE_PATH)

        # SL
        self.tables[Lang.SL] = self.read_table(cfg.SL_JYUTPING_TABLE_PATH)

        # GC
        self.tables[Lang.GC] = self.read_table(cfg.GC_JYUTPING_TABLE_PATH)

        # DJ
        self.tables[Lang.DJ] = self.read_table(cfg.DJ_JYUTPING_TABLE_PATH)

        # JW
        self.tables[Lang.JW] = self.read_table(cfg.JW_JYUTPING_TABLE_PATH)
    
    def read_table(self, path: str):
        table = []
        with open(os.path.join(PROJECT_ROOT_PATH, path), newline='') as csvfile:
            table = [row[1:] for row in csv.reader(csvfile, delimiter=',')][1:]
        return table
    
    def load_tones(self):
        with open(os.path.join(PROJECT_ROOT_PATH, cfg.JYUTPING_TONES_PATH), 'r') as file:
            tone_dict = json.load(file)
            for type in [Lang.HSR, Lang.GC, Lang.SL, Lang.DJ, Lang.JW]:
                self.tones[type] = tone_dict[type]["tones"]
                self.initials[type] = tone_dict[type]["initials"]
                self.finals[type] = tone_dict[type]["finals"]
    
    def _get_gc_tone_type_from_combining_ch(self, sample_tone: tuple[str,str], lang: Lang) -> Tone:
        # extract only the unicode combining character and include the slash if present

        # find the matching tone as described in the GC tones dictionary
        for tone, tone_deconstructed in self.tones[lang].items():
            if sample_tone == tuple(tone_deconstructed):
                return tone
        else:
            return None
    
    def _get_tone_type_from_num(self, lang: Lang, num: str) -> Tone:
        for tone, tone_num in self.tones[lang].items():
            if num == tone_num:
                return Tone[tone]
        else:
            return None
    
    def _answer_tone_q(self, tone_q: str|tuple, lang: Lang) -> Tone:
        if lang == Lang.GC and isinstance(tone_q, tuple):
            return self._get_gc_tone_type_from_combining_ch(tone_q, lang)
        else:
            return self._get_tone_type_from_num(lang, tone_q)



    # def _split_sample_into_jyutping_tone(self, jyutping: str, lang: Lang) -> tuple[str, Tone] | tuple[None, None]:
    #     jyutping = normalize("NFD", jyutping).lower()
    #     gc_match = re.match(r"[a-z]{1,2}(?P<combining_ch>[a-z][\u0304\u0308\u0303\u0300\u0302])[a-z]*(?P<end_slash>/?)", jyutping)
    #     if gc_match:
    #         jyutping = jyutping.replace("/", "").replace(gc_match.group("combining_ch")[1], "")
    #         return jyutping, self._get_gc_tone_type_from_combining_ch(gc_match.group("combining_ch"), gc_match.group("end_slash") == "/", lang)
    #     elif lang == Lang.GC:
    #         # if we don't match, it could be a rare tone, so we iterate through gc tones to check
    #         for rare_tone in (Tone.RARE1, Tone.RARE2, Tone.RARE3, Tone.RARE5, Tone.RARE6):
    #             if jyutping.endswith(self.tones[Lang.GC][rare_tone]):
    #                 return jyutping[:-len(self.tones[Lang.GC][rare_tone])], rare_tone
    #         else:
    #             return None, None

    #     # not gc, so we check for the other jyutping formats
    #     match = re.match(r"(?P<jyutping>[a-z]+)(?P<tone>[0-9]+)", jyutping)
    #     if match:
    #         return match.group("jyutping"), self._get_tone_type_from_num(lang, match.group("tone"))
    #     else:
    #         return None, None

    def search(self, jyutping_q: str, tone_q: str, lang_type: Lang) -> tuple[tuple[int,int], Tone|None]:
        tone = self._answer_tone_q(tone_q, lang_type)

        tables_to_search = [lang_type] if lang_type != Lang.UNK else [Lang.HSR, Lang.GC, Lang.SL, Lang.DJ, Lang.JW]
        
        for table in tables_to_search:
            for i, row in enumerate(self.tables[table]):
                for j, cell in enumerate(row):
                    if jyutping_q in cell:
                        return (j, i), tone
        else:
            return (-1, -1), None
        
    def get_tone(self, lang_type: Lang, tone: Tone) -> dict:
        return self.tones[lang_type][tone]

    def get_initial_final(self, indices: tuple, lang_type: Lang) -> tuple[str, str]:
        initial_i, final_i = indices
        return self.initials[lang_type][initial_i], self.finals[lang_type][final_i]
    
    def get_transdimensional_matches(self, indices: tuple) -> dict:
        initial_i, final_i = indices
        return {type: self.tables[type][final_i][initial_i] for type in [Lang.HSR, Lang.GC, Lang.SL, Lang.DJ, Lang.JW]}
    
    def get_transdimensional_match(self, indices: tuple, lang_type: Lang) -> str:
        initial_i, final_i = indices
        return self.tables[lang_type][final_i][initial_i]

JYUT_TABLES = JyutpingTables()
