def apply_penyim_rules(penyim_q: str):
    if penyim_q.endswith("ei"):
        penyim_q = penyim_q.replace("ei", "(e)i")
    return penyim_q