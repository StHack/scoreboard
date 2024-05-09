# Sthack CTF Interface 2021

## Dev environment

To have a full dev environment up you need to do the following steps:

1. Edit `docker-compose.yml` file to uncomment lines which open app ports and init mongo files
2. On the root of the project, run `docker compose up` to start a valid mongodb instance
3. Create file `server/.env` with the following content

   ```txt
   NODE_ENV=development
   NODE_PATH=./
   APP_MONGO=mongodb://sthack-admin:sthack-password@localhost:27017
   APP_MONGO_DB=sthack-scoreboard
   APP_REDIS=redis://localhost:6379
   APP_SALT=thisismysalt

   # Optional, specify them only if you have valid values
   APP_DISCORD_TOKEN=XXXXXXXXXXXXX
   APP_DISCORD_CHANNEL=XXXXXXXX
   ```

## Sample data

There is many sample data folders that you can use to facilitate the development. They come from from the running of the sthack events however we have removed sensitive data (users passsword & their proposal).

NB: the sample data (2021 dataset) users has their password set to `azerty123` for all users

## Build for prod and prepare VM

```bash
curl -fsSL https://test.docker.com -o install-docker.sh
chmod +x install-docker.sh
./install-docker.sh
git clone https://github.com/StHack/2021-scoreboard.git
cd ./2021-scoreboard
vi docker-compose.yml
# update `docker-compose.yml` and replace `sthack-password` and `thisismysalt` with random string
docker compose build
docker compose up -d
```

Then you will need to create a first account and promote it to admin (see process below for inline method or use mongo-express)
NB: by default mongo-express is still exposed, so don't forget to comment the port opening to close it

## Mongo debugging during event

```bash
docker exec -it sthack-2021_mongo_1 bash

# connect to mongo
mongo -u "sthack-admin" -p "sthack-password"

# mongo command
show dbs
show collections
use sthack-scoreboard
db.achievements.find()
db.achievements.deleteMany({})
db.users.updateOne({ username: "Nagarian" }, { $set: { isAdmin: true } })

# import data
mongoimport messages.json -d test -c messages -u "sthack-admin" -p "sthack-password" --authenticationDatabase admin --jsonArray --drop
```
