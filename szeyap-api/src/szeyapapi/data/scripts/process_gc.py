import re
from pathlib import Path

import pandas as pd
from bs4 import BeautifulSoup
from hanziconv import HanziConv
from parsel import Selector

content = Path("../raw/hed_dictionary.html").read_text()
sel = Selector(text=content)

rows = sel.css("table.data tr")

code_to_field = {
    "xl9827758": "traditional",
    "xl8827758": "simplified",
    "xl8427758": "definition",
}


result_data = []
rows = rows[1:]

for i, row in enumerate(rows):
    result = dict()
    skip = False
    for code, field in code_to_field.items():
        content = row.css(f"td.{code}::text, td.{code} *").getall()
        text = " ".join(content)
        text = BeautifulSoup(text).get_text()

        if text is None:
            text = ""

        if field == "traditional" and not text:
            skip = True
            break

        if field == "definition" and not text:
            skip = True
            break

        result[field] = text

    if not skip:
        # get GPS using the order since the code changes
        for i, cell in enumerate(row.css("td::text")):
            pinyin_index = 6
            gps_index = 5

            for field in code_to_field.values():
                if not result.get(field):
                    pinyin_index -= 1
                    gps_index -= 1

            if i == pinyin_index:
                pinyin_text = cell.get()
                result["pinyin"] = pinyin_text

            if i == gps_index:
                gps_text = cell.get()
                result["gps"] = gps_text

        if result.get("traditional") and (not result.get("simplified")):
            result["simplified"] = HanziConv.toSimplified(result["traditional"])

        if result:
            result_data.append(result)


df = pd.DataFrame(result_data)

# separate into entries!
for index, row in df.iterrows():
    print(row.traditional)
    print(row.definition)

    if index == 10:
        break
