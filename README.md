# Sthack CTF Interface 2021

## Specs

- [ ] Coté participant
  - [ ] s'enregister/se logger
  - [ ] voir les challenges
  - [ ] ranger les challs par catégorie mais permettre de tout voir
  - [ ] scoreboard
  - [ ] afficher si une épreuve a été solve au moins 1 fois
  - [ ] verrouiller les épreuves pendant 10 min quand elles sont solve (animation ? websocket ?) après chaque validation
  - [ ] soumettre 1 flag
  - [ ] Voir le réglement
- [ ] coté admin
  - [ ] pouvoir verrouiller les challenges
  - [ ] avoir les logs de soumission
  - [ ] ajout/suppression d'un chall/modification
  - [ ] pouvoir envoyer des messages à tous les participants
  - [ ] pouvoir ajouter des indices/commentaires/épreuves

## Dev environment

To have a full dev environment up you need to do the following steps:

1. On the root of the project, run `docker compose up` to start a valid mongodb instance
2. Create file `server/.env` with the following content

    ```txt
    NODE_ENV=development
    APP_MONGO=mongodb://sthack-admin:sthack-password@localhost:27017
    ```

3. Generate a certificate for https:

    ```bash
    cd server
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout ./selfsigned.key -out selfsigned.crt
    ```
