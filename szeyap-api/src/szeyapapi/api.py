import os
from connexion import AsyncApp
from connexion.resolver import RelativeResolver
from pathlib import Path
from flask_cors import CORS
import szeyapapi.config as cfg

app = AsyncApp(__name__, specification_dir=f"{os.path.dirname(os.path.realpath(__file__))}/specs")

# Configure CORS
ALLOWED_ORIGINS = [
    'http://184.146.144.14:3000',  # Your local development
    'https://szeyap-frontend-production.up.railway.app',  # Production frontend
    'http://localhost:3000',  # Local development
]

# Add CORS middleware
CORS(app.app, resources={
    r"/api/*": {
        "origins": ALLOWED_ORIGINS,
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "supports_credentials": True
    }
})

app.add_api('szeyap_api.yml', resolver=RelativeResolver('szeyapapi.resolvers'))

server_port = os.getenv('PORT', cfg.FLASK_DEFAULT_PORT)

def main():
    print("Running in development mode")
    app.run(import_string=f"{Path(__file__).stem}:app", host='0.0.0.0', port=int(server_port))

if __name__ == "__main__":
    main()