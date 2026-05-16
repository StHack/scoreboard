import { ExecutionError, Lock, Redlock } from '@sesamecare-oss/redlock'
import {
  Achievement,
  Attempt,
  BaseAttempt,
  BaseSurvey,
  CallbackOrError,
  Challenge,
  CreateTeam,
  from,
  FullTeam,
  isPlayer,
  JoinTeam,
  Player,
  schemaBaseSurvey,
  schemaCreateTeam,
  schemaJoinTeam,
  Survey,
  Team,
  UserRole,
} from '@sthack/scoreboard-common'
import {
  countChallengeAchievement,
  getAchievementBySolveIds,
  registerAchievement,
} from 'db/AchievementDb.js'
import { getSimilarAttempts, registerAttempt } from 'db/AttemptDb.js'
import { checkChallenge, getChallenge } from 'db/ChallengeDb.js'
import { createSurvey } from 'db/SurveyDb.js'
import { createTeam, getFullTeam, getTeamByJoinToken } from 'db/TeamDb.js'
import { getTeamPlayers, updateUser } from 'db/UsersDb.js'
import debug from 'debug'
import { Request } from 'express'
import { Namespace } from 'socket.io'
import { emitEventLog } from './events.js'
import {
  registerNamespaceRequiredRoles,
  registerSocketLogger,
  registerSocketRequiredRoles,
  RequiredRole,
} from './middleware.js'
import { registerSocketConnectivityChange } from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'

const rules: RequiredRole[] = [
  {
    prefix: 'challenge:actions:',
    roles: [UserRole.Player, UserRole.Admin],
    mode: 'any',
  },
  { prefix: 'team:actions:create', roles: [UserRole.User], mode: 'exact' },
  { prefix: 'team:actions:join', roles: [UserRole.User], mode: 'exact' },
  { prefix: 'team:', roles: [UserRole.Player], mode: 'all' },
]

export function registerPlayerNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
  redlock: Redlock,
) {
  const logger = debug('sthack:player')

  registerNamespaceRequiredRoles(playerIo, logger, [UserRole.User], 'all')

  playerIo.on('connection', playerSocket => {
    registerSocketLogger(playerSocket, logger)

    registerSocketRequiredRoles(playerSocket, logger, rules)

    registerSocketConnectivityChange(playerSocket, adminIo, gameIo, playerIo)

    playerSocket.on(
      'challenge:actions:solve',
      async (
        challengeId: string,
        flag: string,
        callback: CallbackOrError<{ isValid: true }>,
      ) => {
        const player = (playerSocket.request as Request).user

        if (!player || !isPlayer(player)) {
          callback({ error: 'You need to join a team to be allowed to play' })
          return
        }

        if (player.roles.includes(UserRole.Admin)) {
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

        const attempt: BaseAttempt = {
          challengeId,
          username: player.username,
          teamId: player.teamId,
          proposal: flag,
        }

        const logAttempt = async () => {
          const saved = await registerAttempt(attempt)
          adminIo.emit('attempt:added', saved)
          return saved
        }

        let lock: Lock | undefined = undefined
        const lockKey = `lock-${player.teamId}-${challengeId}`

        try {
          lock = await redlock.acquire([lockKey], 5_000)

          const checkers = [
            () => checkGameOpen(serverConfig),
            () => checkTeamSolved(attempt),
            () => checkBruteforce(gameIo, attempt, player),
            () => checkFlag(attempt),
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
            teamId: player.teamId,
            username: player.username,
          })
          gameIo.emit('achievement:added', achievement)

          const challenge = (await getChallenge(challengeId)) as Challenge

          const fullAchievement: Achievement = {
            ...achievement,
            team: player.team,
            challenge,
          }
          await emitEventLog(gameIo, 'challenge:solved', {
            message:
              achievementCount === 0
                ? `💥 Breakthrough! "${achievement.username}" Team "${player.team.name}" just solved challenge "${challenge.name}"`
                : `Team "${player.team.name}" just solved challenge "${challenge.name}"`,
            isBreakthrough: achievementCount === 0,
            achievement: fullAchievement,
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

    playerSocket.on(
      'challenge:actions:survey',
      async (
        challengeId: string,
        survey: BaseSurvey,
        callback: CallbackOrError<void>,
      ) => {
        const player = (playerSocket.request as Request).user

        if (!player || !isPlayer(player)) {
          callback({ error: 'Nope' })
          return
        }

        const validations = schemaBaseSurvey.safeParse(survey)
        if (!validations.success) {
          callback({ error: 'Your form has error on it' })
          return
        }

        const payload: BaseSurvey = validations.data

        const achievement = await getAchievementBySolveIds(
          challengeId,
          player.teamId,
        )

        if (!achievement) {
          callback({
            error: 'Finish the challenge in order to fill the survey',
          })
          return
        }

        try {
          const result = await createSurvey({
            ...payload,
            achievementId: achievement._id,
            challengeId: achievement.challengeId,
            teamId: achievement.teamId,
            username: achievement.username,
          })

          callback()

          gameIo.emit('surveys:added', {
            ...result,
            feedback: undefined,
          } satisfies Survey)

          adminIo.emit('surveys:added', result)
        } catch (error) {
          if (typeof error === 'string') {
            callback({ error })
          } else {
            logger('An error occured during survey submission %o', error)
            callback({ error: 'Nope' })
          }
        }
      },
    )

    playerSocket.on(
      'team:actions:create',
      async (request: CreateTeam, callback: CallbackOrError<FullTeam>) => {
        const req = playerSocket.request as Request
        const user = req.user

        if (!user) {
          callback({ error: 'Nope' })
          return
        }

        if (isPlayer(user)) {
          callback({
            error:
              'You are already afiliated to an existing team, ask the staff if you want to change',
          })
        }

        const validations = schemaCreateTeam.safeParse(request)
        if (!validations.success) {
          callback({ error: 'Your form has error on it' })
          return
        }

        const payload: CreateTeam = validations.data

        let lock: Lock | undefined = undefined
        const lockKey = `register-${payload.name}`

        try {
          lock = await redlock.acquire([lockKey], 5_000)

          const fullTeam = await createTeam(payload)

          const updated = await updateUser(user.username, {
            teamId: fullTeam._id,
            roles: [...new Set<UserRole>([...user.roles, UserRole.Player])],
          })

          const player: Player = {
            ...updated,
            teamId: fullTeam._id,
            team: fullTeam,
          }

          req.user = player

          fullTeam.players = [updated]
          callback(fullTeam)
          await playerSocket.join(fullTeam._id)
          gameIo.emit('teams:added', {
            _id: fullTeam._id,
            name: fullTeam.name,
          } satisfies Team)
          adminIo.emit('teams:added', fullTeam)
          adminIo.emit('users:updated', updated)
          await emitGameConfigUpdate()
        } catch (error) {
          if (error instanceof ExecutionError) {
            callback({
              error:
                'This team already exist, you need to join it with the token your mate is going to share with you',
            })
          } else if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            logger('an unexpected error occured %o', error)
            callback({ error: 'An error has occured' })
          }
        } finally {
          await lock?.release().catch(() => {
            logger('release of lock %s failed', lockKey)
          })
        }
      },
    )

    playerSocket.on(
      'team:actions:join',
      async (request: JoinTeam, callback: CallbackOrError<FullTeam>) => {
        const req = playerSocket.request as Request
        const user = req.user

        if (!user) {
          callback({ error: 'Nope' })
          return
        }

        if (isPlayer(user)) {
          callback({
            error:
              'You are already afiliated to an existing team, ask the staff if you want to change',
          })
        }

        const validations = schemaJoinTeam.safeParse(request)
        if (!validations.success) {
          callback({ error: 'Your form has error on it' })
          return
        }

        const payload: JoinTeam = validations.data

        let lock: Lock | undefined = undefined
        const lockKey = `join-${payload.joinToken}`

        try {
          lock = await redlock.acquire([lockKey], 5_000)

          const fullTeam = await getTeamByJoinToken(payload.joinToken)
          if (!fullTeam) {
            callback({
              error: 'Your Join Token seems wrong, check your casing',
            })
            return
          }

          const players = await getTeamPlayers(fullTeam._id)
          const maxTeamSize = await serverConfig.getTeamSize()

          if (players.length >= maxTeamSize) {
            callback({
              error: 'The team is alredy full, you are not allowed to join it',
            })
            return
          }

          const updated = await updateUser(user.username, {
            teamId: fullTeam._id,
            roles: [...new Set<UserRole>([...user.roles, UserRole.Player])],
          })

          const player: Player = {
            ...updated,
            teamId: fullTeam._id,
            team: fullTeam,
          }

          req.user = player

          fullTeam.players = [...players, updated]
          callback(fullTeam)
          await playerSocket.join(player.teamId)
          playerSocket.to(player.teamId).emit('team:updated', fullTeam)
          adminIo.emit('users:updated', updated)
        } catch (error) {
          if (error instanceof ExecutionError) {
            callback({
              error:
                'Another player is already trying to join the team, you need to wait a little bit',
            })
          } else if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            logger('an unexpected error occured %o', error)
            callback({ error: 'An error has occured' })
          }
        } finally {
          await lock?.release().catch(() => {
            logger('release of lock %s failed', lockKey)
          })
        }
      },
    )

    playerSocket.on('team:get', async (callback: CallbackOrError<FullTeam>) => {
      const req = playerSocket.request as Request
      const user = req.user
      if (!user || !isPlayer(user)) {
        callback({ error: 'You are not player, join a team first' })
        return
      }

      const fullTeam = await getFullTeam(user.teamId)
      if (!fullTeam) {
        callback({ error: 'An unexpected error occured' })
        return
      }

      fullTeam.players = await getTeamPlayers(user.teamId)

      callback(fullTeam)
    })
  })

  async function emitGameConfigUpdate() {
    const updatedConfig = await serverConfig.getGameConfig()
    gameIo.emit('game:config:updated', updatedConfig)
  }
}

type CheckResult = Promise<true | string>

async function checkGameOpen(serverConfig: ServerConfig): CheckResult {
  const gameOpened = await serverConfig.getGameOpened()
  return gameOpened || "Game is currently closed, you can't try it now!"
}

async function checkTeamSolved({
  challengeId,
  teamId,
}: BaseAttempt): CheckResult {
  const achievement = await getAchievementBySolveIds(challengeId, teamId)
  return !achievement || 'Already solved by your team!'
}

async function checkFlag({ challengeId, proposal }: BaseAttempt): CheckResult {
  const isValid = await checkChallenge(challengeId, proposal)
  return isValid || "That's not the right flag"
}

async function checkBruteforce(
  gameIo: Namespace,
  attempt: BaseAttempt,
  player: Player,
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
    if (attempts.length < count) {
      continue
    }

    if (warning && attempts.length === count) {
      const challenge = (await getChallenge(attempt.challengeId)) as Challenge
      const fullAttempt: Attempt = {
        ...attempt,
        team: player.team,
        challenge: challenge,
        createdAt: new Date(),
        _id: '',
      }
      await emitEventLog(gameIo, 'player:attempted', {
        message: `Player "${player.username}" has reach the warning threshold of attempts made for the chall "${challenge.name}"`,
        attempt: fullAttempt,
      })
    }

    const delay = from(lastAttempt.createdAt, waiting)
    if (delay > new Date()) {
      return `Bruteforce is not allowed, and you have already attempted this chall ${attempts.length} times ! Wait ${waiting}s`
    }
  }

  return true
}
