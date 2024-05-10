#!/bin/bash
# set -euo pipefail

function rnd_pwd() {
  LENGTH=$1
  tr -dc 'A-Za-z0-9#\-_' </dev/urandom | head -c "${LENGTH:=42}"
  echo
}

usage() {
  echo "Usage: $0 -u username"
  echo "Options:"
  echo "  -u <username> default admin user"
  echo "  -p <password> default admin password"
  echo "  -t <discord_token>"
  echo "  -c <discord_channel>"
  echo "  -i to force install docker"
  echo "  -f to force .env overwrite"
  echo "  -d for dev environment"
}

while getopts u:p:t:c:ifdh flag; do
  case "${flag}" in
  u) USERNAME=${OPTARG} ;;
  p) PASSWORD=${OPTARG} ;;
  t) DISCORD_TOKEN=${OPTARG} ;;
  c) DISCORD_CHANNEL=${OPTARG} ;;
  i) FORCE_INSTALL=True ;;
  f) FORCE_ENV_OVERWRITE=True ;;
  d) DEV=True ;;
  h)
    usage
    exit 0
    ;;
  *)
    echo 'Error in command line parsing' >&2
    exit 1
    ;;
  esac
done

[[ -n "$DEV" ]] && PROFILE="dev" || PROFILE="prod"

# check docker installation
if ! type "docker" >/dev/null || [ -n "$FORCE_INSTALL" ]; then
  echo 'Docker not found proceding to its installation'
  curl -fsSL https://test.docker.com -o install-docker.sh
  chmod +x install-docker.sh
  ./install-docker.sh
else
  echo 'Docker is already present'
fi

# check existence of .env file
if ! test -f ".env" || [ -n "$FORCE_ENV_OVERWRITE" ]; then
  cat >.env <<EOF
MONGO_DATABASE=sthack-scoreboard
MONGO_USERNAME=sthack-admin
MONGO_PASSWORD=$(rnd_pwd)

APP_SALT=$(rnd_pwd 64)

APP_DISCORD_TOKEN=${DISCORD_TOKEN}
APP_DISCORD_CHANNEL=${DISCORD_CHANNEL}
EOF
  echo ".env file has been generated"

  if [ -n "$DEV" ]; then
    cat >>.env <<EOF

ME_USERNAME=${ME_USERNAME:=sthack-me-admin}
ME_PASSWORD=${ME_PASSWORD:=sthack-me-admin}
EOF
    echo ".env file has been update for dev"
  fi

else
  echo ".env already exist, we keep its config"
fi

# prepare docker env
echo "Building docker for $PROFILE"
docker compose --profile "$PROFILE" build

echo "Launching docker for $PROFILE"
docker compose --profile "$PROFILE" up -d --wait

# create admin user
if [ -n "$USERNAME" ]; then
  PASSWORD="${PASSWORD:=$(rnd_pwd)}"

  echo "Creating the admin on $PROFILE"

  if [ -n "$DEV" ]; then
    if [ ! -d "./node_modules" ]; then
      echo "Installing npm packages"
      npm install
    fi

    npm run -w server create-admin -- --user "$USERNAME" --password "$PASSWORD"
  else
    docker compose --profile "$PROFILE" exec website \
      npm run -w server create-admin -- --user "$USERNAME" --password "$PASSWORD"
  fi
fi
