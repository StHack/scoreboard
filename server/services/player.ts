import { getChallengeAchievement, registerAchievement } from 'db/AchievementDb'
import { checkChallenge } from 'db/ChallengeDb'
import debug from 'debug'
import { Request } from 'express'
import { User } from 'models/User'
import { Namespace } from 'socket.io'

const delayTimeInMinutes = 10

export function registerPlayerNamespace(playerIo: Namespace) {
  const logger = debug('sthack:player')

  playerIo.on('connection', playerSocket => {
    playerSocket.use(([event, ...args], next) => {
      logger(
        '%s\t%s\t%s\t%o',
        playerSocket.conn.transport.sid,
        (playerSocket.request as Request<User>).user?.username,
        event,
        args,
      )
      next()
    })

    playerSocket.on(
      'challenge:solve',
      async (challName: string, flag: string, callback) => {
        const user = (playerSocket.request as Request).user!

        if (user.isAdmin) {
          try {
            const isValid = await checkChallenge(challName, flag)
            callback({ isValid })
          } catch (error) {
            if (typeof error === 'string') {
              callback({ error })
            } else {
              callback({ error: 'Nope' })
            }
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

          if (isValid) {
            const achievement = await registerAchievement({
              challenge: challName,
              teamname: user.team,
              username: user.username,
            })

            playerIo.emit('achievement:added', achievement)
          }
        } catch (error) {
          if (typeof error === 'string') {
            callback({ error })
          } else {
            callback({ error: 'Nope' })
          }

          return
        }
      },
    )
  })
}
