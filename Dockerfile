FROM node:16 as build

WORKDIR /client

COPY client/package.json client/package-lock.json ./
RUN npm ci

COPY client .
RUN npm run build

# FROM node:16 as certgenerator

# WORKDIR /app
# RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#   -subj "/C=FR/ST=Aquitaine/L=Bordeaux/O=Sthack/CN=ctf.sthack.fr" \
#   -keyout ./key.pem \
#   -out cert.pem

FROM node:16-alpine as run

WORKDIR /app

COPY server/package.json server/package-lock.json ./
RUN npm ci

COPY server .

COPY --from=build /client/build ./build
# COPY --from=certgenerator /app .

CMD npm run prod

