def apply_penyim_rules(penyim_q: str):
    # Normalize cei to ci
    if penyim_q == "cei":
        penyim_q = "ci"

    # Convert to bracketed format
    if penyim_q.endswith("ei"):
        penyim_q = penyim_q.replace("ei", "(e)i")

    # LH reversal
    if penyim_q.startswith("hl"):
        penyim_q = penyim_q.replace("hl", "lh")

    return penyim_q