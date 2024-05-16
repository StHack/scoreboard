# Changelog

## 2024

- scoreboard
  - 2024 theme: logo, challengecard (Rive animation with dog), background, popup background
  - scoreboard improvement (counts + team charts)
  - update rules
    - remove delay after a solve
    - remove Difficulty variation into score algorithm
    - make reward values proportional to team count (same as challenge)
  - force user to read rules
  - fix rainbow/silver override
- admin
  - add attempts charts
  - add server activity charts
  - add Discord notification integration
  - add feeds for CTFTime
  - move images to its own endpoints
  - allow image/file upload into challenge description
  - allow edition of challenge name
  - security audit done by @laluka
  - pentest resolution
    - race condition (register, flag submission) with redlock
    - prototype pollution with username and teamname
  - add anti-bruteforce system
- chore tech
  - replace cra with viteJS
  - replace redis lib with ioredis, ts-node with tsx
  - split bundle
  - refactor (a lot)
  - fix eslint/prettier config mess
  - reorganize project as a whole with npm workspace / nodemon
  - reorganize docker project and backups
  - improve dev/prod workflow with init/export scripts
  - bug fixing
  - update dependencies

## 2023

- scoreboard
  - rework design globally + improve mobile XP
  - rework scoreboard challenge display
  - introduce 2023 theme: logo, challenge card (pigeon theme with basic animation), background
  - add reward feature
  - allow participants to mark message as read
- admin
  - global rework of interface design with mobile XP improvment
  - rework Table component to allow filtering and sorting and export button
  - add ServerStatistics + logout user action
  - add Attempt screen
  - add markdown editor to improve challenge edition
  - improve challenge flag edition
- chore tech
  - bug fixing
  - update dependencies

## 2022

- scoreboard
  - make Rules description dynamic
  - event diffusion after a challenge solvation
  - allow scoreboard consultation without been logged
- admin
  - add Chall Previewer for admin
  - allow challenge consultation event when it's not solvable
  - force team admin when user gain privilege
  - allow custom category
  - allow adding messages to specific chall
  - add Achievement screen
  - paginate admin section
  - allow edition of team size
  - allow opening and closing of game
- chore tech
  - add linter
  - convert image to webp to reduce image sizing
  - refactoring of component
  - add attempts logging
  - move session to redis instead of mongodb
  - salt chall flag + rework user passwod salt
  - bug fixing
  - update dependencies

## 2021

Init of project
