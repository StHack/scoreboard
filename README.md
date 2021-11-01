# Sthack CTF Interface 2021

## Specs

- [ ] Coté participant
  - [x] s'enregister/se logger
  - [x] voir les challenges
  - [x] ranger les challs par catégorie mais permettre de tout voir
  - [ ] scoreboard
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
  - [ ] Rules: expliquer la règole des 10 minutes
  - [ ] Pouvoir trier les tableaux
  - [ ] Salt les flags des challs
  - [ ] Voir quels challs ont été résolus par quelle équipe

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

## Build for prod

1. Run `docker compose build`
2. Run `docker compose up`

Il a fallu que j'édite le fichier `useSocket` pour spécifier directement le nom dns pour le websocket à la place de `REACT_APP_SERVER_HOST`
