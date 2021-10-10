FROM node:16.7 as build

WORKDIR /client

COPY client .

RUN npm ci && npm run build

# FROM node:16.7 as certgenerator

# WORKDIR /app
# RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#   -subj "/C=FR/ST=Aquitaine/L=Bordeaux/O=Sthack/CN=ctf.sthack.fr" \
#   -keyout ./key.pem \
#   -out cert.pem

FROM node:16.7-alpine as run

WORKDIR /app
COPY server .
RUN npm ci

COPY --from=build /client/build ./build
# COPY --from=certgenerator /app .

CMD npm run prod

