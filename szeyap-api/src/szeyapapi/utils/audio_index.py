import mysql.connector

AUDIO_BASE_URL = "https://taishandict.com/"

def load_audio_index():
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