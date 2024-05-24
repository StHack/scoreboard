import { ExecutionError, Lock, Redlock } from '@sesamecare-oss/redlock'
import {
  Attempt,
  BaseAttempt,
  CallbackOrError,
  Challenge,
  User,
} from '@sthack/scoreboard-common'
import {
  countChallengeAchievement,
  getTeamAchievement,
  registerAchievement,
} from 'db/AchievementDb.js'
import { getSimilarAttempts, registerAttempt } from 'db/AttemptDb.js'
import { checkChallenge, getChallenge } from 'db/ChallengeDb.js'
import debug from 'debug'
import { Request } from 'express'
import { Namespace } from 'socket.io'
import { emitEventLog } from './events.js'
import { registerSocketConnectivityChange } from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'
import { fromNow, getRelativeTime } from './time.js'

export function registerPlayerNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
  redlock: Redlock,
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
        callback: CallbackOrError<{ isValid: true }>,
      ) => {
        const user = (playerSocket.request as Request).user

        if (!user) {
          callback({ error: 'Nope' })
          return
        }

        const attempt: BaseAttempt = {
          challengeId,
          username: user.username,
          teamname: user.team,
          proposal: flag,
        }

        if (user.isAdmin) {
          try {
            const isValid = await checkChallenge(challengeId, flag)
            callback({
              error: isValid
                ? "Flag is correct (even if this message is written in red but you're admin so you cannot score points :P )"
                : "That's not the right flag",
            })
          } catch (error) {
            if (typeof error === 'string') {
              callback({ error })
            } else {
              logger('An error occured during admin flag submission %o', error)
              callback({ error: 'Nope' })
            }
          }

          return
        }

        const logAttempt = async () => {
          const saved = await registerAttempt(attempt)
          adminIo.emit('attempt:added', saved)
          return saved
        }

        let lock: Lock | undefined = undefined
        const lockKey = `lock-${user.team}-${challengeId}`

        try {
          lock = await redlock.acquire([lockKey], 5_000)

          const checkers = [
            () => checkGameOpen(serverConfig),
            () => checkTeamSolved(attempt),
            () => checkFlag(attempt),
            () => checkBruteforce(gameIo, attempt),
          ]

          for (const checker of checkers) {
            const error = await checker()
            if (typeof error === 'string') {
              await logAttempt()
              callback({ error })
              return
            }
          }

          callback({ isValid: true })
          const achievementCount = await countChallengeAchievement(challengeId)

          const achievement = await registerAchievement({
            challengeId,
            teamname: user.team,
            username: user.username,
          })
          gameIo.emit('achievement:added', achievement)

          const challenge = (await getChallenge(challengeId)) as Challenge
          await emitEventLog(gameIo, 'challenge:solve', {
            message:
              achievementCount === 0
                ? `💥 Breakthrough! "${achievement.username}" Team "${achievement.teamname}" just solved challenge "${challenge.name}"`
                : `Team "${achievement.teamname}" just solved challenge "${challenge.name}"`,
            isBreakthrough: achievementCount === 0,
            achievement,
            challenge,
          })
        } catch (error) {
          await logAttempt()
          if (typeof error === 'string') {
            callback({ error })
          } else if (error instanceof ExecutionError) {
            callback({
              error:
                'Bruteforce is not allowed, please stop that or you will be expulsed from the CTF',
            })
          } else {
            logger('An error occured during flag submission %o', error)
            callback({ error: 'Nope' })
          }
        } finally {
          await lock?.release().catch(() => {
            logger('release of lock %s failed', lockKey)
          })
        }
      },
    )
  })
}

type CheckResult = Promise<true | string>

async function checkGameOpen(serverConfig: ServerConfig): CheckResult {
  const gameOpened = await serverConfig.getGameOpened()
  return gameOpened || "Game is currently closed, you can't try it now!"
}

async function checkTeamSolved({
  challengeId,
  teamname,
}: BaseAttempt): CheckResult {
  const achievements = await getTeamAchievement(teamname)
  return (
    !achievements.find(a => a.challengeId === challengeId) ||
    'Already solved by your team!'
  )
}

async function checkFlag({ challengeId, proposal }: BaseAttempt): CheckResult {
  const isValid = await checkChallenge(challengeId, proposal)
  return isValid || "That's not the right flag"
}

async function checkBruteforce(
  gameIo: Namespace,
  attempt: BaseAttempt,
): CheckResult {
  const attempts = await getSimilarAttempts(attempt)
  if (attempts.length === 0) {
    return true
  }

  const rules = [
    { count: 20, waiting: 60, warning: true },
    { count: 10, waiting: 10 },
    { count: 5, waiting: 5 },
  ]

  const lastAttempt = attempts[0] as Attempt

  for (const { count, waiting, warning } of rules) {
    const delay = fromNow(waiting)
    if (attempts.length >= count && lastAttempt.createdAt < delay) {
      if (warning && attempts.length === count) {
        const challenge = await getChallenge(attempt.challengeId)
        await emitEventLog(gameIo, 'player:attempt', {
          message: `Team "${attempt.teamname}" has reach the warning threshold of attempts made for the chall "${challenge?.name ?? ''}"`,
          attempt,
          challenge,
        })
      }

      return `Bruteforce is not allowed, and you have already attempted this chall ${attempts.length} times ! Wait ${getRelativeTime(delay)}`
    }
  }

  return true
}
