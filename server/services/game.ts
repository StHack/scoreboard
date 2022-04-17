import { listAchievement } from 'db/AchievementDb'
import { listChallenge } from 'db/ChallengeDb'
import { listMessage } from 'db/MessageDb'
import { listTeam } from 'db/UsersDb'
import { GameConfig } from 'models/GameConfig'
import { Namespace } from 'socket.io'
import { ServerConfig } from './serverconfig'

export function registerGameNamespace(
  gameIo: Namespace,
  serverConfig: ServerConfig,
) {
  gameIo.on('connection', gameSocket => {
    gameSocket.on('challenge:list', async callback => {
      const challenges = await listChallenge()
      callback(challenges)
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
