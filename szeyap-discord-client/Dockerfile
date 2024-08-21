FROM node:21.1-alpine
RUN mkdir -p /usr/src/szeyap-discord-client
WORKDIR /usr/src/szeyap-discord-client
COPY package.json ./package.json
RUN npm install
RUN npm install -g nodemon
COPY . ./