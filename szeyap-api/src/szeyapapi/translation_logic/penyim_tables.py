import json
import os
from pathlib import Path

import numpy as np
import pandas as pd

import szeyapapi.config as cfg
from szeyapapi.utils.enums import LanguageFormats as Lang
from szeyapapi.utils.enums import Tones as Tone

PROJECT_ROOT_PATH = os.path.join(os.path.dirname(__file__), "..")
PENYIM_LANG_TYPES = [Lang.HSR, Lang.GC, Lang.SL, Lang.DJ, Lang.JW]


class PenyimTables:
    def __init__(self) -> None:
        self.initials = {}
        self.finals = {}
        self.tones = {}
        self.tables = {}
        self.allowed_segments = set()

        self.load_tables()
        self.load_tones()
        self.load_allowed_segments()

    def load_tables(self):
        df_dict = pd.read_excel(
            Path(PROJECT_ROOT_PATH, cfg.PENYIM_TABLES_PATH),
            sheet_name=None,
            index_col=0,
            keep_default_na=False,
            na_values=[""],
        )  # Important for keeping "nan" cell

        def clean_df(df: pd.DataFrame):
            last_col = df.columns.get_loc("y")
            df = df[df.columns[: last_col + 1]]
            return df

        for lang, lang_string in zip(
            PENYIM_LANG_TYPES, ["HSR", "GPS", "SL", "DJ", "WPS"]
        ):
            self.tables[lang] = clean_df(df_dict[lang_string])

    def load_tones(self):
        tone_dict = json.loads(
            Path(PROJECT_ROOT_PATH, cfg.PENYIM_TONES_PATH).read_text()
        )
        for type in PENYIM_LANG_TYPES:
            self.tones[type] = tone_dict[type]["tones"]
            self.initials[type] = tone_dict[type]["initials"]
            self.finals[type] = tone_dict[type]["finals"]

    def _get_gc_tone_type_from_combining_ch(
        self, sample_tone: tuple[str, str], lang: Lang
    ) -> Tone:
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

    def _answer_tone_q(self, tone_q: str | tuple, lang: Lang) -> Tone:
        if isinstance(tone_q, tuple):
            return self._get_gc_tone_type_from_combining_ch(tone_q, Lang.GC)
        else:
            return self._get_tone_type_from_num(lang, tone_q)

    def search(self, penyim_q: str, tone_q: str) -> tuple[tuple[int, int], Tone | None]:
        for table in PENYIM_LANG_TYPES:
            tone = self._answer_tone_q(tone_q, table)
            if tone:
                break

        for table in PENYIM_LANG_TYPES:
            table_arr = self.tables[table].to_numpy()
            result = np.where(table_arr == penyim_q)

            row_result = result[0]
            col_result = result[1]
            if (row_result.size > 0) and (col_result.size > 0):
                # Take the first match
                j = int(col_result[0])  # row number
                i = int(row_result[0])  # column number

                # print(f"Found {penyim_q} at ({j}, {i}) with tone {tone} in {table}")
                return (j, i), tone

        return (-1, -1), None

    def get_tone(self, lang_type: Lang, tone: Tone) -> dict:
        return self.tones[lang_type].get(tone, "")

    def get_initial_final(self, indices: tuple, lang_type: Lang) -> tuple[str, str]:
        initial_i, final_i = indices
        return self.initials[lang_type][initial_i], self.finals[lang_type][final_i]

    def get_transdimensional_match(self, indices: tuple, lang_type: Lang) -> str:
        initial_i, final_i = indices
        result = self.tables[lang_type].iat[final_i, initial_i]
        if isinstance(result, float) and np.isnan(result):
            return ""
        return result

    def load_allowed_segments(self):
        for lang in PENYIM_LANG_TYPES:
            self.allowed_segments.update(self.tables[lang].stack().values)


PENYIM_TABLES = PenyimTables()
