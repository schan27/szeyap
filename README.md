# Szeyap App

## Developing locally
1. Prerequisite: `uv` is installed
2. `cd szeyap-api`
3. Create the environment `uv venv venv` 
4. Activate it `source venv/bin/activate` and sync it `uv sync`
5. Download the spaCy model `uv run --with spacy spacy download en_core_web_sm`
6. Start the server: `uv run src/szeyapapi/api.py --reload`
7. Access Swagger UI at `http://localhost:8000/api/ui`


## Steps to run
Each service exists as a separate Docker container, so you can run each separately or run using `docker compose` which will *glue* all the containers together and allow your client to communicate with your api, for example.

#### [DEV] Running from top level (all containers)
```
docker compose -f docker-compose.dev.yml build
docker compose -f docker-compose.dev.yml up
```

#### [PROD] Running from top level (all containers)
```
docker compose -f docker-compose.yml build
docker compose -f docker-compose.yml up
```

#### Running Profiles
You may not want to run everything, ie if you are developing the discord bot you may not need to start the web container. You can launch with different profile configurations by passing in the --profile configuration. Profile names can be found in `docker-compose.yml`. As an example ...
```
docker compose --profile with-web-client up
```

---

Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg