#!/bin/bash
# set -euo pipefail

COLLECTIONS_TO_EXPORT=(
  "achievements"
  "attempts"
  "challenges"
  "files"
  "messages"
  "rewards"
  "serveractivitystatistics"
  "users"
)

YEAR=$(date +%Y)

for COLLECTION_NAME in "${COLLECTIONS_TO_EXPORT[@]}"; do
  echo "${COLLECTION_NAME}"

  mongoexport \
    -d "${MONGO_INITDB_DATABASE}" \
    -c "${COLLECTION_NAME}" \
    -u "${MONGO_INITDB_ROOT_USERNAME}" \
    -p "${MONGO_INITDB_ROOT_PASSWORD}" \
    --authenticationDatabase admin --jsonArray --pretty \
    -o "/backups/${YEAR}/${COLLECTION_NAME}.json"

done

ATTEMPTS_FILE="/backups/${YEAR}/attempts.json"
cp "$ATTEMPTS_FILE" "/backups/${YEAR}/attempts-uncensored.json"
jq '(.[].proposal) |= ""' "$ATTEMPTS_FILE" > "$ATTEMPTS_FILE.tmp" && mv "$ATTEMPTS_FILE.tmp" "$ATTEMPTS_FILE"

USERS_FILE="/backups/${YEAR}/users.json"
jq '(.[].password) |= ""' "$USERS_FILE" > "$USERS_FILE.tmp" && mv "$USERS_FILE.tmp" "$USERS_FILE"
