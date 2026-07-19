import re
from itertools import chain
from unicodedata import normalize

from ..utils.enums import PenyimFormats
from ..utils.enums import Tones as Tone
from .penyim_rules import apply_penyim_rules, match_syllables_backward
from .penyim_tables import PENYIM_LANG_TYPES, PENYIM_TABLES

RARE_TONES = [Tone.RARE1, Tone.RARE2, Tone.RARE3, Tone.RARE5, Tone.RARE6]
DIACRITICS_PATTERN = re.compile("([\u0300-\u036f])")
TONE_PATTERN = r"""
    (?:                                      # Non-capturing group for alternation
        [1-6]{1,3}(?![a-z0-9])               # 1–3 digit tone numbers (with lookahead guard)
        |
        /                                    # Slash for rising tone
        |
        [-`*‘’〉]+                            # One or more characters from your symbol set
    )?
"""


class Penyim:
    def __init__(self, sample: str, penyim_format: PenyimFormats) -> None:
        self.sample = normalize("NFD", sample).lower()
        self.indices = []
        self.formats = []
        self.tone = []
        self.errors = {}
        self.format = penyim_format
        self.init_penyim(penyim_format)

    def _repr_format(self, format_index: int) -> str:
        indices = self.indices[format_index]
        tone = self.tone[format_index]
        formats = self.formats[format_index]

        if format_index in self.errors:
            return self.errors[format_index]

        return f"""Pos: [{indices[0]}, {indices[1]}] Tone: {tone}
  HSR: {formats[PenyimFormats.HSR]}
  GC: {formats[PenyimFormats.GC]}
  SL: {formats[PenyimFormats.SL]}
  DJ: {formats[PenyimFormats.DJ]}
  JW: {formats[PenyimFormats.JW]}
"""

    def __str__(self) -> str:
        preamble = (
            f"Parse Error: Invalid Penyim sample '{self.sample}'"
            if not all(self.formats)
            else ""
        )

        return preamble + "\n".join(
            self._repr_format(format_i) for format_i in range(len(self.formats))
        )

    def preprocess_sample(self, sample: str) -> str:
        sample = sample.replace("\u0342", "\u0302")
        return normalize("NFD", sample)

    # recognize penyim looking phrases and separate tone from initial_final
    def extract_penyim_phrases(self) -> tuple[tuple]:
        syllables = []
        if self.format == PenyimFormats.UNK:
            all_initials = list(chain.from_iterable(PENYIM_TABLES.initials.values()))
            all_finals = list(chain.from_iterable(PENYIM_TABLES.finals.values()))
        else:
            all_initials = PENYIM_TABLES.initials[self.format]
            all_finals = PENYIM_TABLES.finals[self.format]

        # Append initials to the list for edge cases
        all_initials = all_initials + ["hl", "gn", "sh", "w"]

        # Account for labial onglide inclusion in initials
        for initial in all_initials:
            if initial.startswith("o"):
                all_initials.append("u" + initial)

        initials_sorted = sorted(filter(None, all_initials), key=len, reverse=True)
        initials_pattern = "|".join([re.escape(f) for f in initials_sorted])

        all_finals = all_finals + ["ee"]

        # Account for labial onglide inclusion in finals
        for final in all_finals:
            if final.startswith("o"):
                all_finals.append("u" + final)

        finals_sorted = sorted(filter(None, all_finals), key=len, reverse=True)
        finals_pattern = "|".join([re.escape(f) for f in finals_sorted])

        syllable_pattern = re.compile(
            rf"""(?xiu)                      # enables VERBOSE, IGNORECASE, UNICODE
      (?P<syllable>
          (?P<initial>{initials_pattern})?   # optional initial
          (?P<final>{finals_pattern})        # required final 
          (?P<tone>{TONE_PATTERN})?          # optional tone
      )
      """
        )

        start = 0
        # Remove brackets
        for bracket in "()[]{{}}":
            self.sample = self.sample.replace(bracket, "")

        # Remove diacritics
        normalized = "".join(DIACRITICS_PATTERN.sub("", self.sample).split())

        already_parsed = False
        if "-" in normalized:
            syllable_list = []
            for i, syllable in enumerate(normalized.split("-")):
                result = match_syllables_backward(syllable_pattern, syllable)
                if len(result) != 1:
                    break

                result = list(result.pop())
                if i > 0:
                    prev_syllable = syllable_list[i - 1][0].group(0)
                    result[1] += len(prev_syllable)
                    result[2] += len(prev_syllable)

                syllable_list.append(result)

            already_parsed = True
            # Remove dashes between each syllable for processing
            normalized = normalized.replace("-", "")
            self.sample = self.sample.replace("-", "")

        if not already_parsed:
            syllable_list = match_syllables_backward(syllable_pattern, normalized)

        for match, start, end in syllable_list:
            # Find the next non-whitespace character
            if (start != len(normalized)) and (normalized[start].isspace()):
                non_whitespace_index = re.search(r"\S", normalized[start:]).start()
                start += non_whitespace_index

            # Step one: Deal with the segment
            initial = match.group("initial")
            if initial is None:
                initial = ""
            final = match.group("final")

            # Normalize the labial onglide inclusion
            if final.startswith("uo") and final != "uo":
                final = final[1:]

            if initial.startswith("uo"):
                initial = initial[1:]

            segment = initial + final
            segment = apply_penyim_rules(segment)

            # Step two: Deal with the tone
            # Add one to the segment span as the diacritic is one character long
            if start > 0:
                start += 1
                end += 1
            orig_segment = self.sample[start : end + 1]
            diacritic_match = DIACRITICS_PATTERN.search(orig_segment)
            tone = match.group("tone")

            if diacritic_match is not None:
                is_rising = tone == "/"
                diacritic = diacritic_match.group(0)
                if is_rising:
                    tone = (diacritic, "/")
                else:
                    tone = (diacritic,)

            syllables.append((segment, tone))

        return syllables

    def _set_as_err(self, msg):
        self.errors[0] = msg
        self.indices.append((-1, -1))
        self.formats.append(None)
        self.tone.append(None)

    def init_penyim(self, format: PenyimFormats):
        if format not in PENYIM_LANG_TYPES + [PenyimFormats.UNK]:
            self._set_as_err(f"Invalid language type '{format}'")
            return

        phrases = self.extract_penyim_phrases()

        if not phrases:
            self._set_as_err("No penyim phrases found")
            return

        for i, (penyim_q, tone_q) in enumerate(phrases):
            indices, tone = PENYIM_TABLES.search(penyim_q, tone_q)
            if indices == (-1, -1):
                self.indices.append((-1, -1))
                self.formats.append(None)
                self.tone.append(None)
                self.errors[i] = f"Failed to parse penyim candidate '{self.sample}'"
            else:
                self.indices.append(indices)
                self.tone.append(tone)
                # Initialize format for all romanizations
                self.formats.append(
                    {
                        lang: self._merge_initial_final_tone(indices, tone, lang)
                        for lang in PENYIM_LANG_TYPES
                    }
                )

    def _merge_initial_final_tone(
        self, indices: tuple[int, int], tone: Tone, format: PenyimFormats
    ):
        tone = PENYIM_TABLES.get_tone(format, tone)

        if format == PenyimFormats.GC:  # Treat Gene Chin tones differently
            if (tone) and (tone not in RARE_TONES):
                combining_ch, slash = (
                    (tone[0], "/") if len(tone) == 2 else (tone[0], "")
                )
                initial, final = PENYIM_TABLES.get_initial_final(indices, format)
                return initial + final[:1] + combining_ch + final[1:] + slash

        result = PENYIM_TABLES.get_transdimensional_match(indices, format) + tone
        return result

    def render_in_original_format(self, format: PenyimFormats) -> str:
        result = ""
        for syllable in self.formats:
            if syllable is None:
                # There was an error in the penyim parsing
                return ""
            result += syllable[format]
        return result

    def summarize_errors(self):
        if not self.errors:
            return None
        error_msg = "Failed to parse:"
        for i in self.errors:
            error_msg += f" <{self.sample}>"
        return error_msg

    def has_errors(self):
        return bool(self.errors)

    def as_dict(self) -> dict:
        return {
            lang: self.render_in_original_format(lang) for lang in PENYIM_LANG_TYPES
        }

    def __eq__(self, other):
        if not isinstance(other, Penyim):
            return False
        # TODO: Update to take tone into account
        return self.indices == other.indices

    def __ne__(self, other) -> bool:
        if not isinstance(other, Penyim):
            return True
        return self.indices != other.indices
