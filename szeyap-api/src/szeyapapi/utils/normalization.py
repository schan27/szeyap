def sl_normalization(raw: str):
    penyim_string = raw.replace("[", "").replace("]", "")
    splitted = penyim_string.split("/")
    penyim_string = " ".join(s.strip() for s in splitted if not s.isdigit())
    return penyim_string
