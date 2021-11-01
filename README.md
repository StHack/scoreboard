# Sthack CTF Interface 2021

## Specs

- [ ] Coté participant
  - [x] s'enregister/se logger
  - [x] voir les challenges
  - [x] ranger les challs par catégorie mais permettre de tout voir
  - [x] scoreboard
  - [x] afficher si une épreuve a été solve au moins 1 fois
  - [x] verrouiller les épreuves pendant 10 min quand elles sont solve (animation ? websocket ?) après chaque validation
  - [x] soumettre 1 flag
  - [x] Voir le réglement
- [ ] coté admin
  - [x] pouvoir verrouiller les challenges
  - [ ] avoir les logs de soumission
  - [x] ajout/suppression d'un chall/modification
  - [x] pouvoir envoyer des messages à tous les participants
  - [ ] pouvoir ajouter des indices/commentaires/épreuves
- [ ] V2
  - [ ] Pouvoir spécifier ses propres catégories
  - [ ] Rules: expliquer la règle des 10 minutes
  - [ ] Pouvoir trier les tableaux
  - [ ] Salt les flags des challs
  - [ ] Voir quels challs ont été résolus par quelle équipe
  - [ ] Bouton "End Game"
  - [ ] Rendre le scoreboard disponible sans compte utilisateur
  - [ ] Paramétriser la limite du nombre de joueur
  - [ ] Pouvoir exporter les données à la fin de la game
  - [ ] Avoir des graphs de stats
  - [ ] Pouvoir clean les achievements

## Dev environment

To have a full dev environment up you need to do the following steps:

1. On the root of the project, run `docker compose up` to start a valid mongodb instance
2. Create file `server/.env` with the following content

    ```txt
    NODE_ENV=development
    APP_MONGO=mongodb://sthack-admin:sthack-password@localhost:27017
    APP_REDIS=redis://localhost:6379
    ```

3. Create file `client/.env` with the following content

    ```txt
    REACT_APP_SERVER_HOST=ws://localhost:3000
    ```

NB: the sample data (2021 dataset) users has their password set to `azerty123` for all users

## Build for prod

1. Run `docker compose build`
2. Run `docker compose up`

Il a fallu que j'édite le fichier `useSocket` pour spécifier directement le nom dns pour le websocket à la place de `REACT_APP_SERVER_HOST`

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

# import data
mongoimport messages.json -d test -c messages -u "sthack-admin" -p "sthack-password" --authenticationDatabase admin --jsonArray --drop
```
