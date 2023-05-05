import { listAchievement } from 'db/AchievementDb'
import { listChallenge } from 'db/ChallengeDb'
import { listMessage } from 'db/MessageDb'
import { listTeam } from 'db/UsersDb'
import { GameConfig } from 'models/GameConfig'
import { Namespace } from 'socket.io'
import { ServerConfig } from './serverconfig'
import { registerSocketConnectivityChange } from './serveractivity'

export function registerGameNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
) {
  gameIo.on('connection', gameSocket => {
    registerSocketConnectivityChange(gameSocket, adminIo, gameIo, playerIo)

    gameSocket.on('challenge:list', async callback => {
      const challenges = await listChallenge()

      const gameOpened = await serverConfig.getGameOpened()

      callback(
        gameOpened
          ? challenges
          : challenges.map(c => ({ ...c, description: '' })),
      )
    })

    gameSocket.on('achievement:list', async callback => {
      const achievements = await listAchievement()
      callback(achievements)
    })

    gameSocket.on('game:config', async callback => {
      const result: GameConfig = await serverConfig.getGameConfig()
      callback(result)
    })

    gameSocket.on('game:messages', async callback => {
      const messages = await listMessage()
      callback(messages)
    })

    gameSocket.on('game:teams', async callback => {
      const teams = await listTeam()
      callback(teams)
    })
  })
}
