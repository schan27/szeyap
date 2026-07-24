from hanziconv import HanziConv

def add_missing_hanzi_form(defn: dict) -> dict:
    simp = defn['SIMP']
    trad = defn['TRAD']

    if simp and trad:
        pass
    elif simp:
        trad = HanziConv.toTraditional(simp)
        # compare unicode
        if simp == trad:
            trad = None
    else:
        simp = HanziConv.toSimplified(trad)
        # compare unicode
        if simp == trad:
            simp = None

    return {
        'SIMP': simp,
        'TRAD': trad
    }

