import os
from connexion import AsyncApp
from connexion.resolver import RelativeResolver
from pathlib import Path
from starlette.middleware.cors import CORSMiddleware
import szeyapapi.config as cfg

app = AsyncApp(__name__, specification_dir=f"{os.path.dirname(os.path.realpath(__file__))}/specs")

# Add API
app.add_api('szeyap_api.yml', resolver=RelativeResolver('szeyapapi.resolvers'))

# Configure CORS with more permissive settings
origins = [
    'http://184.146.144.14:3000',      # Your local development
    'https://szeyap-frontend-production.up.railway.app',  # Production frontend
    'http://localhost:3000',            # Local development
    'http://127.0.0.1:3000',           # Local development IP
]

# In development, allow all origins
if os.getenv('ENVIRONMENT') != 'production':
    origins.append('*')

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r'https?://(localhost|127\.0\.0\.1)(:[0-9]+)?',  # Allow any localhost port
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"]
)

server_port = os.getenv('PORT', cfg.FLASK_DEFAULT_PORT)

def main():
    print("Running in development mode")
    app.run(import_string=f"{Path(__file__).stem}:app", host='0.0.0.0', port=int(server_port))

if __name__ == "__main__":
    main()