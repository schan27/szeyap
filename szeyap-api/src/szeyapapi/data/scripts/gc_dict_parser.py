import re
import csv
import json

from szeyapapi.data.scripts.phrase_definition import PhraseDefinition

# logic to convert various formats to human readable and 
# structured json list format.
# May decide to convert to trie data structure to improve search
# performance

PARSE_STATS = {
  "total": 0,
  "matched": 0,
  "failed": 0,
  "failed_rows": []
}

class RawDictionaryParser():

  CHINESE_CHAR_SET = r"\u4e00-\u9fff\u3400-\u4dbf\U00020000-\U0002A6Df\U0002a700-\U0002b73f\U0002B740-\U0002B81F\U0002B820-\U0002CEAF\U0002CEB0-\U0002EBEF\U0002F800-\U0002FA1F"
  PTRN_STRT_RGX = f"(?=^\(?[{CHINESE_CHAR_SET}]|or [a-zA-Z]*[{CHINESE_CHAR_SET}]|^<台> ?)(?:or |^<台> ?)?"
  TRAD_CH_RGX = f"(?P<trad>[{CHINESE_CHAR_SET}][^[\s]*)"
  SIMP_CH_RGX = f"(?P<simp>[(){CHINESE_CHAR_SET}][^[\s]*)"
  JYTPNG_RGX = f"(?P<jyutping>[a-zA-Z-]*(?:[\u00C0-\u024F]|Ẽ|ẽ|m̃|M̃|M̂|m̂|M̈|m̈|M̄|m̄|M̀|m̀|n̄|N̄|ñ|Ñ|ǹ|Ǹ|n̂|N̂|n̈|N̈)+[^\s]*)"
  PENYIM_RGX = f"(?P<penyim>[a-zA-Z-]*[\u00C0-\u024F̈]+[^\s]*)"


  def __init__(self, gc_path="../raw/updated_hed.csv", sl_path="../stephen-li.json") -> None:
    self.gc_path = gc_path
    self.sl_path = sl_path
  
  def parse_possible_multiline(self, csv_as_list: list, idx: int, parsed: list):
    # not implemented yet
    return 0
    starting_line = csv_as_list[idx]
    starting_line_defn = starting_line[7]
    current_idx = idx
    if not re.match(f"{self.PTRN_STRT_RGX}{self.SIMP_CH_RGX}"):
      return

  def generate_parsed_entry(self, extracted_tsh_matches, defn, is_taishanese=False):
    extracted_tsh_matches = list(extracted_tsh_matches)

    traditional = []
    simplified = []
    jyutping = []
    penyim = []

    for match in extracted_tsh_matches:
      traditional.append(match.group("trad"))
      simplified.append(match.group("simp"))
      jyutping.append(match.group("jyutping"))
      penyim.append(match.group("penyim"))
    
    last_match_end = extracted_tsh_matches[-1].end()
    english = defn[last_match_end:].replace(",_", ", ")
    
    phrase = PhraseDefinition(
      definition=english,
      simplified=simplified,
      traditional=traditional,
      jyutping=jyutping,
      penyim=penyim,
      is_taishanese=is_taishanese
    )

    print(phrase)
    
    return phrase


  def parse_gene_chin(self) -> dict:
    parsed = []
    with open(self.gc_path, "r") as f:
      reader = csv.reader(f)
      csv_as_list = list(reader)
      for idx, row in enumerate(csv_as_list):

        # is single word?
        if row[3]:
          parsed.append(
            PhraseDefinition(
              definition=row[7],
              simplified=[row[4]],
              traditional=[row[3]],
              jyutping=[row[5]],
              penyim=[row[6]]
          ))
          PARSE_STATS["matched"] += 1
        else:
          defn = row[7].replace(r"[⁰¹²³⁴⁵⁶⁷⁸⁹]|<wr\.>\s", "");
          defn = defn.replace(", ", ",_").strip()

          defn_rgx_pattern = re.compile(f"{self.PTRN_STRT_RGX}{self.SIMP_CH_RGX}?(?:\[{self.TRAD_CH_RGX}\])? {self.JYTPNG_RGX}? ?{self.PENYIM_RGX}? ?")
          print(defn.strip())
          extracted_tsh_matches = list(defn_rgx_pattern.finditer(defn))

          # empty cell
          if not defn:
            continue
          elif re.match("^or", defn):
            print(f"WARNING: [{idx}] row {row} starts with 'or'")
            continue
          # means the word is a composition definition
          elif re.match(r"^\(?(c|C)omposition(( [ts])|( traditional)|( simplified))?: .*\)?", defn):
            continue
          # means the word has a related defn/word, future development can include links to other words
          elif re.match("^<又>", defn): 
            continue
          # means the word has a link to another word
          elif re.match(r"^\(See.*", defn):
            continue
          # means the word usage is taishanese specific
          elif re.match(r"^<台>", defn):
            if not defn.strip():
              print(f"WARNING: Definition is empty [{idx}] {row}!")
              continue

            phrase_defn = self.generate_parsed_entry(extracted_tsh_matches, defn, is_taishanese=True)
            PARSE_STATS["matched"] += 1
          elif extracted_tsh_matches:
            if not defn.strip():
              print(f"WARNING: Definition is empty [{idx}] {row}!")
              continue
            
            phrase_defn = self.generate_parsed_entry(extracted_tsh_matches, defn)
            parsed.append(phrase_defn)
            PARSE_STATS["matched"] += 1
          else:
              skip = self.parse_possible_multiline(csv_as_list, idx, parsed)
              if skip == 0:
                print(f"REGEX failed for [{idx}] row {row} -> {defn}")
                PARSE_STATS["failed"] += 1
                PARSE_STATS["failed_rows"].append(row)
              continue

    # formatting needed
    # - replace _ with space
    # - replace ⍪ with comma_space

    # when extracting penyim, rmb to remove periods

    return parsed

  def parse_to_file(self, file="gene_chin.json"):
    gc = [phrase.asdict() for phrase in self.parse_gene_chin()]
    print("Saving to file...")
    with open(file, "w") as f:
      json.dump(gc, f)


if __name__ == "__main__":
  parser = RawDictionaryParser()
  parser.parse_to_file()

  PARSE_STATS["total"] = PARSE_STATS["matched"] + PARSE_STATS["failed"]
  
  with open("failed_lines.csv", "w") as f:
    f.writelines([f"{'|'.join(line)}\n" for line in PARSE_STATS["failed_rows"]])
  
  print(f"""\n\n===== Parsing stats =====
Matched: {PARSE_STATS['matched']} ({round(PARSE_STATS['matched']/PARSE_STATS['total'], 2)*100} %)
Failed: {PARSE_STATS['failed']} ({round(PARSE_STATS['failed']/PARSE_STATS['total'], 2)*100} %)
Total lines analyzed: {PARSE_STATS['total']}
""")
