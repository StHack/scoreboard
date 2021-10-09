import {
  getChallengeAchievement,
  listAchievement,
  registerAchievement,
} from 'db/AchievementDb'
import { checkChallenge, listChallenge } from 'db/ChallengeDb'
import { countTeam } from 'db/UsersDb'
import { Request } from 'express'
import { GameConfig } from 'models/GameConfig'
import { Namespace } from 'socket.io'

const delayTimeInMinutes = 10

export function registerGameNamespace(gameIo: Namespace) {
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

      const result: GameConfig = {
        solveDelay: delayTimeInMinutes,
        teamCount,
      }

      callback(result)
    })

    gameSocket.on(
      'challenge:solve',
      async (challName: string, flag: string, callback) => {
        const user = (gameSocket.request as Request).user!

        if (user.isAdmin) {
          try {
            const isValid = await checkChallenge(challName, flag)
            callback({ isValid })
          } catch (error) {
            callback({ error: 'Nope' })
          }

          return
        }

        const achievements = await getChallengeAchievement(challName)

        if (achievements.find(a => a.teamname === user.team)) {
          callback({ error: 'Already solved by your team !' })
          return
        }

        const lastSolvedDelayer = new Date()
        lastSolvedDelayer.setMinutes(
          lastSolvedDelayer.getMinutes() - delayTimeInMinutes,
        )

        if (achievements.find(a => a.createdAt > lastSolvedDelayer)) {
          callback({ error: `Can't be solved now` })
          return
        }

        try {
          const isValid = await checkChallenge(challName, flag)
          callback({ isValid })
        } catch (error) {
          callback({ error: 'Nope' })
          return
        }

        const achievement = await registerAchievement({
          challenge: challName,
          teamname: user.team,
          username: user.username,
        })

        gameSocket.emit('achievement:added', achievement)
      },
    )
  })
}
