FROM node:12-alpine AS builder

RUN npm install -g typescript@~3.5.3
WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm install
COPY server ./server
WORKDIR /usr/src/app/server
RUN npm run-script build

FROM node:12-alpine

WORKDIR /usr/src/app
COPY ./server/package*.json ./
RUN npm install
COPY --from=builder /usr/src/app/server/lib ./server

EXPOSE 8080
CMD [ "node", "server/index.js" ]
