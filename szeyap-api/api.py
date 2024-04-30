import os
from connexion import AsyncApp
from pathlib import Path
import config

app = AsyncApp(__name__, specification_dir='./specs')

app.add_api('szeyap_api.yml')

server_port = os.getenv('PORT', config.FLASK_DEFAULT_PORT)

if __name__ == "__main__":
    if os.getenv('FLASK_ENV') == 'development':
        print("Running in development mode")
        app.run(import_string=f"{Path(__file__).stem}:app", host='0.0.0.0', port=server_port)
    else:
        app.run(host='0.0.0.0', port=server_port)