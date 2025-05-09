# Sthack CTF Scoreboard Interface

## Dev environment

To have a full dev environment up you need to do the following steps:

### Step 1 - Prepare docker & database

#### Init script

Run `./init.sh -d`, the script will setup docker and create a default confiugration into `.env` file with mongo-express too (to check the data)

NB: by default, the last year datas will be seeded into mongo database (see [Sample data](#sample-data)), update `docker-compose.yml` if you want another years datas

NB: you can also specify arguments `-u your_username` (and optionaly `-p your_password` if you want a specific password) to also generate a default admin user

#### Manual steps

1. Create manually the .env file as you whish

   ```bash
   MONGO_DATABASE=sthack-scoreboard
   MONGO_USERNAME=sthack-admin
   MONGO_PASSWORD=sthack-password

   ME_USERNAME=sthack-me-admin
   ME_PASSWORD=sthack-me-password
   ```

2. Then run `docker compose --profile dev up -d` to start databases
3. Create file `server/.env` with the following content

   ```bash
   NODE_ENV=development
   NODE_PATH=./
   APP_MONGO=mongodb://sthack-admin:sthack-password@localhost:27017 # update it with the same values of `.env` you've choosen on the previous step
   APP_MONGO_DB=sthack-scoreboard
   APP_REDIS=redis://localhost:6379
   APP_SALT=thisismysalt

   # Optional, specify them only if you have valid values
   APP_DISCORD_TOKEN=XXXXXXXXXXXXX
   APP_DISCORD_CHANNEL=XXXXXXXX
   ```

4. Run the npm command `npm i` to restore packages
5. Run the npm command `npm run start` to launch everything, then go to `http://localhost:3000` to access the app or `http://localhost:8081` to access mongo-express or `http://localhost:8001` to access Redinsight
6. (Optional): you can create a first admin user by using the npm script `npm run -w server create-admin -- --user my_user --password my_password` or by using init script (see above)

### Sample data

There is many sample data folders that you can use to facilitate the development. They come from from the running of the sthack events however we have removed sensitive data (users passsword & their proposal).

NB: the sample data (2021 dataset) users has their password set to `azerty123` for all users

### Node NPM

The expected current node version is 20 (nvm is recommended), and we have used the [npm workspace feature](https://docs.npmjs.com/cli/v10/using-npm/workspaces) so basically you can run both server and client from the root folder.
If you need to exec command for one of thoses only you need to append `-w server` or `-w client`. ie: `npm i -w client react@latest`

### Docker compose

Docker is the primary tool used to run this project, you need to have a valid up-to-date instance to run it (see [Init script](#init-script) to install it automatically). Compose file use the [profile feature](https://docs.docker.com/compose/profiles/) by default no service is available without specifying one of them. You have two profile avaialable: `dev` and `prod`, so for all docker compose that you want to run, you will need to always specify the profile that you want to use, ie: `docker compose --profile dev up -d`

Also, by default all the data are stored in a named volumes, so if you want/need to clean-up all the datas the most simple way is to use the command `docker compose --profile "*" down -v`, it will stop and remove all the containers and all the associated volumes

## Production details

### Build for prod and prepare VM

```bash
git clone git@github.com:StHack/scoreboard.git
cd ./scoreboard
./init.sh -u your_username # specify the username you want for the first admin (recommended)
```

### CTFtime

Feeds specifications for CTFtime has been implemented cf: <https://ctftime.org/json-scoreboard-feed>

- For **Team standings feed** specify endpoint: `/api/ctftime/team`
- For **Capture log feed** specify endpoint: `/api/ctftime/capture`

### Discord notification

To support discord notification, we are using webhook functionality, so you need to setup it for the new channel, from it you'll be able to retrieve the `channel_id` and a `token`., then you can use them to run the init script, ie:

```bash
./init.sh -u your_username -t discord_token -c discord_channel
```

or manually update `.env` file to add variables `APP_DISCORD_TOKEN` and `APP_DISCORD_CHANNEL`, then restart service with `sudo docker compose --profile prod up -d`

> To check if your configuration is right, you can use that HTTP request:

```http
@wchannel = 1369236898719076402
@wtoken = XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
###
# webhook
###
POST https://discord.com/api/webhooks/{{wchannel}}/{{wtoken}}
User-Agent: Sthack Bot - CTF interface notifier
Content-Type: application/json

{
  "content": "Test message 💥"
}
```

### Fixing code issues during events

If a major issue occurs during the events that is required to make a code fix, follow the this process:

1. Make a fix on your computer and test it
2. Make a commit and push it
3. ssh into the machine and run `git pull`
4. Then re-do a `./init.sh` or `sudo docker compose --profile prod build && sudo docker compose --profile prod up -d`

### Mongo debugging during event

```bash
sudo docker compose exec mongo mongosh -u "sthack-admin" -p "sthack-password"

# mongo command
show dbs
use sthack-scoreboard
show collections
db.achievements.find()
db.achievements.deleteMany({})
db.users.updateOne({ username: "your_username" }, { $set: { isAdmin: true } })

# import data
mongoimport messages.json -d test -c messages -u "sthack-admin" -p "sthack-password" --authenticationDatabase admin --jsonArray --drop
```

### Post-event

Don't forget to make the final export and commit it to this git. For that, run the following commands:

```bash
sudo docker compose --profile prod exec mongo /backups/_mongo_exports.sh
git add *
ssh-keygen -t ed25519 -C email@email.com
cat ~/.ssh/id_ed25519.pub
# push that key into github settings -> https://github.com/settings/keys
git config user.name ""
git config user.email email@email.com
git commit -m "feat: add $(date +%Y) edition data"
git push
## retrieve sensitive data for staff-only analysis
sudo docker compose --profile prod logs > logs.txt
sudo docker compose --profile prod logs website > logs-website.txt
## from your computer
scp ubuntu@XX.XX.XX.XX:/home/ubuntu/scoreboard/backups/$(date +%Y)/attempts-uncensored.json .
scp ubuntu@XX.XX.XX.XX:/home/ubuntu/scoreboard/logs.txt .
scp ubuntu@XX.XX.XX.XX:/home/ubuntu/scoreboard/logs-website.txt .
```

## Tests

In order to run Playwright test, you will need to create a specific admin account:

```js
username: 'user42',
password: 'user42',
team: 'admin',
```
