

def apply_penyim_rules(segment: str):
    # Normalize cei to ci
    if segment == "cei":
        segment = "ci"

    # Convert to bracketed format
    if segment.endswith("ei"):
        segment = segment.replace("ei", "(e)i")

    # LH reversal
    if segment.startswith("hl"):
        segment = segment.replace("hl", "lh")
    
    # NG reversal
    if segment.startswith("gn"):
        segment = segment.replace("gn", "ng")
    return segment


def match_syllables_backward(syllable_regex, text):
    result = []
    pos = len(text)
    
    while pos > 0:
        # Try to match as far back as possible
        match = None
        for start in range(0, pos):
            sub = text[start:pos]
            m = syllable_regex.fullmatch(sub)
            if m:
                match = (m, start, pos)
                break  # prefer longest match from the end

        if match:
            m, start, end = match
            result.insert(0, (
                m,
                start,
                end
            ))
            pos = start
        else:
            raise ValueError(f"No match ending at position {pos}: '{text[:pos]}'")
    
    return result