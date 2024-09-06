import os
# paths are relative to the root of the project

FLASK_DEFAULT_PORT=8000
STEPHEN_LI_DICTIONARY_PATH = "data/stephen_li_dictionary.json"
GENE_CHIN_DICTIONARY_PATH = "data/gene_chin_dictionary.json"

# Embeddings
STEPHEN_LI_EN_EMBEDDINGS_PATH = "data/embeddings/STEPHEN_LI_EN_EMBEDDINGS.PT"
GENE_CHIN_EN_EMBEDDINGS_PATH = "data/embeddings/GENE_CHIN_EN_EMBEDDINGS.PT"
STEPHEN_LI_CH_EMBEDDINGS_PATH = "data/embeddings/STEPHEN_LI_CH_EMBEDDINGS.PT"
GENE_CHIN_CH_EMBEDDINGS_PATH = "data/embeddings/GENE_CHIN_CH_EMBEDDINGS.PT"

HSR_JYUTPING_TABLE_PATH = "data/hsr_jyutping_table.csv"
SL_JYUTPING_TABLE_PATH = "data/sl_jyutping_table.csv"
GC_JYUTPING_TABLE_PATH = "data/gc_jyutping_table.csv"
DJ_JYUTPING_TABLE_PATH = "data/dj_jyutping_table.csv"
JW_JYUTPING_TABLE_PATH = "data/jw_jyutping_table.csv"
JYUTPING_TONES_PATH = "data/tones.json"


PROJ_ROOT = os.path.dirname(os.path.abspath(__file__))