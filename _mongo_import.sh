#!/bin/bash
# set -euo pipefail

for FULL_FILENAME in /docker-entrypoint-initdb.d/*.json;
do
  FILENAME=${FULL_FILENAME##*/}
  COLLECTION_NAME="${FILENAME%.json}"

  echo "${COLLECTION_NAME}"

  mongoimport "${FULL_FILENAME}" \
    -d "${MONGO_INITDB_DATABASE}" \
    -c "${COLLECTION_NAME}" \
    -u "${MONGO_INITDB_ROOT_USERNAME}" \
    -p "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin --jsonArray --drop
done

