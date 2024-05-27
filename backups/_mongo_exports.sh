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

# clean attempts values
ATTEMPTS_FILE="/backups/${YEAR}/attempts.json"
cp "$ATTEMPTS_FILE" "/backups/${YEAR}/attempts-uncensored.json"
jq '(.[].proposal) |= ""' "$ATTEMPTS_FILE" > "$ATTEMPTS_FILE.tmp" && mv "$ATTEMPTS_FILE.tmp" "$ATTEMPTS_FILE"

# clean users password
USERS_FILE="/backups/${YEAR}/users.json"
jq '(.[].password) |= ""' "$USERS_FILE" > "$USERS_FILE.tmp" && mv "$USERS_FILE.tmp" "$USERS_FILE"

# clean unused files
FILES_FILE="files.json"
jq -r '.[].name' <"${FILES_FILE}" | while read -r FILE_NAME; do
  IS_REFERENCED=$(grep -R -l "$FILE_NAME" . --exclude="${FILES_FILE}" -c)

  if [ -n "$IS_REFERENCED" ]; then
    echo "${FILE_NAME} has been referenced into ${IS_REFERENCED}"
  else
    echo "${FILE_NAME} has not been referenced, removing it"
    jq "map(select(.name != \"${FILE_NAME}\"))" "$FILES_FILE" > "$FILES_FILE.tmp" && mv "$FILES_FILE.tmp" "$FILES_FILE"
  fi
done
