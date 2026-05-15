#!/bin/bash
# set -uo pipefail

for FULL_FILENAME in /backups/*.json;
do
  FILENAME=${FULL_FILENAME##*/}
  COLLECTION_NAME="${FILENAME%.json}"

  echo "${COLLECTION_NAME}"

  set +e # we allow mongoimport to fail because it is on empty import
  mongoimport "${FULL_FILENAME}" \
    -d "${MONGO_INITDB_DATABASE}" \
    -c "${COLLECTION_NAME}" \
    -u "${MONGO_INITDB_ROOT_USERNAME}" \
    -p "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin --jsonArray --drop --maintainInsertionOrder
done
