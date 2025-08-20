from ..utils.enums import LanguageFormats as Lang
from ..utils.enums import Tones as Tone
from .penyim_tables import PENYIM_TABLES, PENYIM_LANG_TYPES

import re
from unicodedata import normalize


RARE_TONES = [Tone.RARE1, Tone.RARE2, Tone.RARE3, Tone.RARE5, Tone.RARE6]


class Penyim:

  def __init__(self, sample: str, lang_type: Lang) -> None:
    self.sample = normalize("NFD", sample)
    self.indices = []
    self.formats = []
    self.tone = []
    self.positions = []
    self.errors = {}
    self.init_penyim(lang_type)
  
  def _repr_format(self, format_index: int) -> str:
    indices = self.indices[format_index]
    tone = self.tone[format_index]
    formats = self.formats[format_index]

    if format_index in self.errors:
      return self.errors[format_index]

    return f"""Pos: [{indices[0]}, {indices[1]}] Tone: {tone}
  HSR: {formats[Lang.HSR]}
  GC: {formats[Lang.GC]}
  SL: {formats[Lang.SL]}
  DJ: {formats[Lang.DJ]}
  JW: {formats[Lang.JW]}
"""

  def __str__(self) -> str:
    preamble = f"Parse Error: Invalid Penyim sample '{self.sample}'" if not all(self.formats) else ""
    return preamble + "\n".join(self._repr_format(format_i) for format_i in range(len(self.formats)))
  
  def preprocess_sample(self, sample: str) -> str:
    sample = sample.replace("\u0342", "\u0302")
    return normalize("NFD", sample)
  
  # recognize penyim looking phrases and separate tone from initial_final
  def extract_penyim_phrases(self) -> tuple[tuple]:
    match_exp = r"(?:[a-z]{0,3}(?P<diacritic>[\u0304\u0308\u0303\u0300\u0302])[a-z]*/?)|(?:(?P<initial_final>[a-zɛɪɬŋɔə]+)(?P<tone>[1-6]{1,3}(?![a-z0-9])|‘-|`-|\*-|`‘|〉-|-\*|-’|-|‘|\*|`|〉))"
    
    phrases = []
    positions = []
    for match in re.finditer(match_exp, self.sample):
      tone = match.group("diacritic")
      if tone:
        penyim = match[0].replace(match.group("diacritic")[0], "").replace("/", "")
        tone = (match.group("diacritic"), "/") if "/" in match[0] else tuple(match.group("diacritic"))
      else:
        penyim = match.group("initial_final")
        tone = match.group("tone")
      phrases.append((penyim, tone))
      positions.append(match.span())

    return phrases, positions
  
  def _set_as_err(self, msg):
    self.errors[0] = msg
    self.indices.append((-1, -1))
    self.formats.append(None)
    self.tone.append(None)
    self.positions = [(0, len(self.sample))]

  def init_penyim(self, lang_type: Lang):
    if lang_type not in PENYIM_LANG_TYPES + [Lang.UNK]:
      self._set_as_err(f"Invalid language type '{lang_type}'")
      return

    phrases, positions = self.extract_penyim_phrases()
    self.positions = positions

    if not phrases:
      self._set_as_err("No penyim phrases found")
      return

    for i, (penyim_q, tone_q) in enumerate(phrases):
      indices, tone = PENYIM_TABLES.search(penyim_q, tone_q, lang_type)
      if indices == (-1, -1) or tone is None:
        self.indices.append((-1, -1))
        self.formats.append(None)
        self.tone.append(None)

        fail_start, fail_end = self.positions[i]
        self.errors[i] = (f"Failed to parse penyim candidate '{self.sample[fail_start:fail_end]}' at position ({str(fail_start)}, {str(fail_end)})")
      else:
        self.indices.append(indices)
        self.tone.append(tone)
        # Initialize format for all romanizations
        self.formats.append({lang: self._merge_initial_final_tone(indices, tone, lang) 
                             for lang in PENYIM_LANG_TYPES})

  def _merge_initial_final_tone(self, indices: tuple[int,int], tone: Tone, lang: Lang):
    tone = PENYIM_TABLES.get_tone(lang, tone)

    if lang == lang.GC: # Treat Gene Chin tones differently
      if tone not in RARE_TONES:
        combining_ch, slash = (tone[0], "/") if len(tone) == 2 else (tone[0], "")
        initial, final = PENYIM_TABLES.get_initial_final(indices, lang)
        return initial + final[:1] + combining_ch + final[1:] + slash
      
    result = PENYIM_TABLES.get_transdimensional_match(indices, lang) + tone
    return result

  def render_in_original_format(self, lang: Lang) -> str:
    curr = 0
    result = ""
    for i, pos in enumerate(self.positions):
      result += self.sample[curr:pos[0]]
      if (i in self.errors):
        result += f"[ERR:{self.sample[pos[0]:pos[1]]}]"
      else:
        result += self.formats[i][lang]
      curr = pos[1]
    result += self.sample[curr:]
    return result

  def summarize_errors(self):
    if not self.errors:
      return None
    error_msg = "Failed to parse:"
    for i in self.errors:
      start, end = self.positions[i]
      error_msg += f" <{self.sample[start:end]}>"
    return error_msg

  def has_errors(self):
    return bool(self.errors)

  def as_dict(self) -> dict:
    return {lang: self.render_in_original_format(lang) for lang in PENYIM_LANG_TYPES}
  
  def __eq__(self, other):
    if not isinstance(other, Penyim):
      return False
    # TODO: Update to take tone into account 
    return self.indices == other.indices

  def __ne__(self, other) -> bool:
    if not isinstance(other, Penyim):
      return True
    return self.indices != other.indices
