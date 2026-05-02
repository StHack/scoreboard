# syntax=docker/dockerfile:1.7-labs
FROM node:24-alpine as base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base as build

WORKDIR /src

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm fetch

COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm run build:scoreboard

FROM base as run

WORKDIR /app

COPY --from=build /src/dist .
COPY --from=build /src/tsconfig.json /tsconfig.json

USER node

CMD npm run prod
