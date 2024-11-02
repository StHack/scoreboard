# syntax=docker/dockerfile:1.7-labs
FROM node:22-alpine as build

WORKDIR /src

COPY --parents /*/package.json ./package.json package-lock.json ./
RUN npm ci

COPY . .

RUN npm run build
RUN cp -r ./client/dist ./server/build && rm -rf client

FROM node:22-alpine as run

WORKDIR /app

COPY --from=build /src .

USER node

CMD npm run prod
