import mysql.connector
 
AUDIO_BASE_URL = "https://taishandict.com/"
 
_audio_index: dict | None = None
 
def load_audio_index() -> dict:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="#Kunyang1196!", #TODO: change mysql cred later - Jackson
        database="TaishaneseV4"
    )

    cursor = conn.cursor()
 
    cursor.execute("""
        SELECT Mandarin, Cantonese, English, Sound
        FROM dictionary
    """)
 
    index = {}
 
    for mandarin, cantonese, english, sound in cursor.fetchall():
        if mandarin:
            index[mandarin] = sound
        if cantonese:
            index[cantonese] = sound
        if english:
            index[english.lower()] = sound
 
    conn.close()
 
    return index
 
 # Return the in-memory audio index, loading from the database if necessary
def get_audio_index() -> dict:
    global _audio_index
    if _audio_index is None:
        _audio_index = load_audio_index()
    return _audio_index