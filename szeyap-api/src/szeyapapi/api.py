import os
from connexion import AsyncApp
from connexion.resolver import RelativeResolver
from pathlib import Path
import szeyapapi.config as cfg
import logging
logger = logging.getLogger("szeyapapi")
from szeyapapi.logging.logger import configure_logger


from szeyapapi.dictionaries.genechin_dictionary import GC
from szeyapapi.dictionaries.stephenli_dictionary import SL

app = AsyncApp("szeyapapi", specification_dir=f"{os.path.dirname(os.path.realpath(__file__))}/specs")

app.add_api('szeyap_api.yml', resolver=RelativeResolver('szeyapapi.resolvers'))

server_port = os.getenv('PORT', cfg.FLASK_DEFAULT_PORT)

configure_logger("szeyapapi")

# load dictionaries and embeddings
GC.load_dictionary()
GC.load_embeddings()
SL.load_dictionary()
SL.load_embeddings()

def main():
    logger.info("Running Szeyap API in development mode")
    app.run(import_string=f"{Path(__file__).stem}:app", host='0.0.0.0', port=int(server_port))

if __name__ == "__main__":
    main()