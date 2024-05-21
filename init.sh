#!/bin/bash
# set -euo pipefail

function rnd_pwd() {
  LENGTH=$1
  tr -dc 'A-Za-z0-9\-_' </dev/urandom | head -c "${LENGTH:=42}"
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

COLOR_RESET="\e[0;0m"
COLOR_GREEN="\e[0;32m"
COLOR_CYAN="\e[0;36m"

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
  MONGO_DATABASE=sthack-scoreboard
  MONGO_USERNAME=sthack-admin
  MONGO_PASSWORD=$(rnd_pwd)
  SALT=$(rnd_pwd 64)

  cat >.env <<EOF
MONGO_DATABASE=${MONGO_DATABASE}
MONGO_USERNAME=${MONGO_USERNAME}
MONGO_PASSWORD=${MONGO_PASSWORD}

APP_SALT=${SALT}

APP_DISCORD_TOKEN=${DISCORD_TOKEN}
APP_DISCORD_CHANNEL=${DISCORD_CHANNEL}
EOF
  echo ".env file has been generated"

  if [ -n "$DEV" ]; then
    ME_USERNAME=sthack-me-admin
    ME_PASSWORD=sthack-me-password

    cat >>.env <<EOF

ME_USERNAME=${ME_USERNAME}
ME_PASSWORD=${ME_PASSWORD}
EOF
    echo ".env file has been update for dev"
    echo -e "${COLOR_GREEN}Mongo express${COLOR_RESET} is available at ${COLOR_GREEN}http://localhost:8081${COLOR_RESET} with:"
    echo -e "username: ${COLOR_GREEN}${ME_USERNAME}${COLOR_RESET}"
    echo -e "password: ${COLOR_GREEN}${ME_PASSWORD}${COLOR_RESET}"
    echo -e "${COLOR_CYAN}Redisinsight${COLOR_RESET} is available at ${COLOR_CYAN}http://localhost:8001${COLOR_RESET}"

    if ! test -f "server/.env" || [ -n "$FORCE_ENV_OVERWRITE" ]; then
      cat >server/.env <<EOF
NODE_ENV=development
NODE_PATH=./
APP_MONGO=mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017
APP_MONGO_DB=${MONGO_DATABASE}
APP_REDIS=redis://localhost:6379
APP_SALT=${SALT}
EOF
      if [ -n "$DISCORD_TOKEN" ]; then
        cat >>.env <<EOF

APP_DISCORD_TOKEN=${DISCORD_TOKEN}
APP_DISCORD_CHANNEL=${DISCORD_CHANNEL}
EOF
      fi

      echo "server/.env file has been generated"
    fi
  fi

else
  echo ".env already exist, we keep its config"
fi

# prepare docker env
echo "Building docker for $PROFILE"
sudo docker compose --profile "$PROFILE" build

echo "Launching docker for $PROFILE"
sudo docker compose --profile "$PROFILE" up -d --wait

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
    sudo docker compose --profile "$PROFILE" exec website \
      npm run -w server create-admin -- --user "$USERNAME" --password "$PASSWORD"
  fi
fi

if [ -n "$DEV" ]; then
  echo -e "Now, you can use ${COLOR_CYAN}npm run start${COLOR_RESET} and start coding"
fi
