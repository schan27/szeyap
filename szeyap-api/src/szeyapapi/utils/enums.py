from enum import StrEnum

class LanguageFormats(StrEnum):
  EN = "EN"
  CH = "CH"
  HSR = "HSR"
  SL = "SL"
  GC = "GC"
  DJ = "DJ"
  JW = "JW"
  UNK = "UNK"

class Tones(StrEnum):
  HIGH_FLAT = "HIGH_FLAT"
  MID_FLAT = "MID_FLAT"
  LOW_FLAT = "LOW_FLAT"
  MID_FALL = "MID_FALL"
  LOW_FALL = "LOW_FALL"
  MID_RISE = "MID_RISE"
  LOW_RISE = "LOW_RISE"
  M_FALL_RISE = "M_FALL_RISE"
  L_FALL_RISE = "L_FALL_RISE"
  RARE1 = "RARE1"
  RARE2 = "RARE2"
  RARE3 = "RARE3"
  RARE4 = "RARE4"
  RARE5 = "RARE5"
  RARE6 = "RARE6"
  RARE7 = "RARE7"
  RARE8 = "RARE8"
  RARE9 = "RARE9"

# each query type corresponds to a different resolver/api route
class QueryTypes(StrEnum):
  TRANSLATE = "TRANSLATE"
  CONVERT_JYUTPING = "CONVERT_JYUTPING"