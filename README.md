# Szeyap App
Szeyap app is a ... [include description here]

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