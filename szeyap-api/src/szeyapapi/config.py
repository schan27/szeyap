import os

# paths are relative to the root of the project
PROJ_ROOT = os.path.dirname(os.path.abspath(__file__))

FLASK_DEFAULT_PORT = 8000
STEPHEN_LI_DICTIONARY_PATH = os.path.join(PROJ_ROOT, "data", "stephen_li_dictionary.json")
GENE_CHIN_DICTIONARY_PATH = os.path.join(PROJ_ROOT, "data", "gene_chin_dictionary.json")
PENYIM_TONES_PATH = os.path.join(PROJ_ROOT, "data", "tones.json")
PENYIM_TABLES_PATH = os.path.join(PROJ_ROOT, "data", "initials_finals.xlsx")


