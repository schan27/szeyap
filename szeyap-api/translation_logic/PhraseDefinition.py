
class PhraseDefinition:
    def __init__(self, definition=[], simplified=[], traditional=[], penyim=[], jyutping=[], is_taishanese=False):
        self.simplified = simplified
        self.traditional = traditional
        self.definition = definition
        self.penyim = penyim
        self.jyutping = jyutping
        self.is_taishanese = is_taishanese

    def __repr__(self):
        return f"""Phrase - {self.simplified or self.traditional}{f" <台>" if self.is_taishanese else ""}\n  
    Tradn: {self.traditional}
    Penym: {self.penyim}
    Jytpg: {self.jyutping}
    Engls: {self.definition}
"""
    
    def asdict(self):
        return {
            "TRAD": self.traditional,
            "SIMP": self.simplified,
            "JYUTPING": self.jyutping,
            "PENYIM": self.penyim,
            "DEFN": self.definition
        }