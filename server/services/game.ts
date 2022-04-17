import { listAchievement } from 'db/AchievementDb'
import { listChallenge } from 'db/ChallengeDb'
import { listMessage } from 'db/MessageDb'
import { countTeam, listTeam } from 'db/UsersDb'
import { GameConfig } from 'models/GameConfig'
import { Namespace } from 'socket.io'
import { ServerConfig } from './serverconfig'

const delayTimeInMinutes = 10

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
      const teamCount = await countTeam()
      const teamSize = await serverConfig.getTeamSize()

      const result: GameConfig = {
        solveDelay: delayTimeInMinutes * 60 * 1000,
        teamCount,
        baseChallScore: 50,
        teamSize,
      }

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
