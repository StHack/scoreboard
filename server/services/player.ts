import {
  getChallengeAchievement,
  registerAchievement,
} from 'db/AchievementDb.js'
import { registerAttempt } from 'db/AttemptDb.js'
import { checkChallenge, getChallenge } from 'db/ChallengeDb.js'
import debug from 'debug'
import { Request } from 'express'
import { CallbackOrError } from 'models/Common.js'
import { User } from 'models/User.js'
import { Namespace } from 'socket.io'
import { emitEventLog } from './events.js'
import { registerSocketConnectivityChange } from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'

export function registerPlayerNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
) {
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

    registerSocketConnectivityChange(playerSocket, adminIo, gameIo, playerIo)

    playerSocket.on(
      'challenge:solve',
      async (
        challengeId: string,
        flag: string,
        callback: CallbackOrError<{ isValid: boolean }>,
      ) => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const user = (playerSocket.request as Request).user!

        if (user.isAdmin) {
          try {
            const isValid = await checkChallenge(challengeId, flag)
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

        const attempt = await registerAttempt({
          challengeId,
          username: user.username,
          teamname: user.team,
          proposal: flag,
        })
        adminIo.emit('attempt:added', attempt)

        const gameOpened = await serverConfig.getGameOpened()
        if (!gameOpened) {
          callback({ error: "Game is currently closed, you can't try it now!" })
          return
        }

        const achievements = await getChallengeAchievement(challengeId)
        if (achievements.find(a => a.teamname === user.team)) {
          callback({ error: 'Already solved by your team!' })
          return
        }

        try {
          const isValid = await checkChallenge(challengeId, flag)
          callback({ isValid })

          if (!isValid) {
            return
          }

          const achievement = await registerAchievement({
            challengeId,
            teamname: user.team,
            username: user.username,
          })
          gameIo.emit('achievement:added', achievement)

          const chall = await getChallenge(challengeId)
          await emitEventLog(gameIo, 'challenge:solve', {
            message:
              achievements.length === 0
                ? `💥 Breakthrough! "${achievement.username}" Team "${achievement.teamname}" just solved challenge "${chall?.name ?? ''}"`
                : `Team "${achievement.teamname}" just solved challenge "${chall?.name ?? ''}"`,
            isBreakthrough: achievements.length === 0,
            achievement,
            challenge: chall,
          })
        } catch (error) {
          if (typeof error === 'string') {
            callback({ error })
          } else {
            callback({ error: 'Nope' })
          }
        }
      },
    )
  })
}
