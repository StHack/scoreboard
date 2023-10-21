import { listAchievement } from 'db/AchievementDb'
import { listChallenge } from 'db/ChallengeDb'
import { listMessage } from 'db/MessageDb'
import { listReward } from 'db/RewardDb'
import { listTeam } from 'db/UsersDb'
import { GameConfig } from 'models/GameConfig'
import { Namespace } from 'socket.io'
import { registerSocketConnectivityChange } from './serveractivity'
import { ServerConfig } from './serverconfig'

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
          ? challenges.map(c => (c.isBroken ? { ...c, description: '' } : c))
          : challenges.map(c => ({ ...c, description: '' })),
      )
    })

    gameSocket.on('achievement:list', async callback => {
      const achievements = await listAchievement()
      callback(achievements)
    })

    gameSocket.on('reward:list', async callback => {
      const rewards = await listReward()
      callback(rewards)
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
