import {
  Attempt,
  BaseChallenge,
  BaseReward,
  Callback,
  CallbackOrError,
  Challenge,
  FileContent,
  Reward,
  ServerActivityStatistics,
  TimestampedServerActivityStatistics,
  User,
  UserRole,
} from '@sthack/scoreboard-common'
import { createHash } from 'crypto'
import {
  countChallengeAchievement,
  removeAchievement,
} from 'db/AchievementDb.js'
import { listAttempt } from 'db/AttemptDb.js'
import {
  createChallenge,
  getChallenge,
  listChallenge,
  removeChallenge,
  updateChallenge,
} from 'db/ChallengeDb.js'
import { createFile } from 'db/FIleDb.js'
import { addMessage } from 'db/MessageDb.js'
import { createReward, removeReward } from 'db/RewardDb.js'
import { listServerActivityStatistics } from 'db/ServerActivityStatisticsDb.js'
import { listUser, removeUser, updateUser } from 'db/UsersDb.js'
import debug from 'debug'
import { Request } from 'express'
import { extname } from 'path'
import { Namespace } from 'socket.io'
import { emitEventLog } from './events.js'
import {
  registerNamespaceRequiredRoles,
  registerSocketLogger,
  registerSocketRequiredRoles,
  RequiredRole,
} from './middleware.js'
import {
  getServerActivityStatistics,
  registerSocketConnectivityChange,
} from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'
import { ServerStatisticsFetcher } from './serverStatistics.js'

const requiredRoles: RequiredRole[] = [
  { prefix: 'game:actions:', role: UserRole.GameMaster },
  { prefix: 'achievement:actions:', role: UserRole.GameMaster },

  { prefix: 'game:annoucement:actions:', role: UserRole.Announcer },
  { prefix: 'challenge:actions:', role: UserRole.Author },
  { prefix: 'reward:actions:', role: UserRole.Rewarder },

  { prefix: 'users:actions:changeTeam', role: UserRole.Moderator },
  { prefix: 'users:actions:changePassword', role: UserRole.Moderator },
  { prefix: 'users:actions:logout', role: UserRole.Moderator },

  { prefix: 'users:actions:delete', role: UserRole.RoleManager },
  { prefix: 'users:actions:changeRoles', role: UserRole.RoleManager },
]

export function registerAdminNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
  serverStatFetcher: ServerStatisticsFetcher,
) {
  const logger = debug('sthack:admin')

  serverStatFetcher.registerCallback(stats => {
    adminIo.emit('game:activity:list:updated', stats)
  })

  registerNamespaceRequiredRoles(adminIo, logger, [UserRole.Admin], 'all')

  adminIo.on('connection', adminSocket => {
    registerSocketLogger(adminSocket, logger)

    registerSocketRequiredRoles(adminSocket, logger, requiredRoles)

    registerSocketConnectivityChange(adminSocket, adminIo, gameIo, playerIo)

    adminSocket.on(
      'challenge:list',
      async (callback: Callback<Challenge[]>) => {
        const challenges = await listChallenge()
        callback(challenges)
      },
    )

    adminSocket.on(
      'challenge:actions:create',
      async (chall: BaseChallenge, callback: CallbackOrError<Challenge>) => {
        try {
          if (!chall.flag) {
            throw new Error('flag is required')
          }

          const challenge = await createChallenge(chall)
          callback(challenge)
          gameIo.emit('challenge:added', challenge)
          adminIo.emit('challenge:added', challenge)
          await emitEventLog(gameIo, 'challenge:created', {
            message: `A new challenge has been added, try your chance on "${challenge.name}"`,
          })
        } catch (error) {
          if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            callback({ error: 'an error occured' })
          }
        }
      },
    )

    adminSocket.on(
      'reward:actions:create',
      async (reward: BaseReward, callback: CallbackOrError<Reward>) => {
        try {
          const rewardCreated = await createReward(reward)
          callback(rewardCreated)
          gameIo.emit('reward:added', rewardCreated)
          await emitEventLog(gameIo, 'reward:added', {
            message: `A reward has been given to team "${rewardCreated.teamname}" for ${rewardCreated.value.toString()} points`,
            reward: rewardCreated,
            serverConfig,
          })
        } catch (error) {
          if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            callback({ error: 'an error occured' })
          }
        }
      },
    )

    adminSocket.on(
      'challenge:actions:update',
      async (
        challengeId: string,
        chall: BaseChallenge,
        callback: CallbackOrError<Challenge>,
      ) => {
        try {
          const challenge = await updateChallenge(challengeId, chall)
          callback(challenge)
          gameIo.emit('challenge:updated', challenge)
          adminIo.emit('challenge:updated', challenge)
          await emitEventLog(gameIo, 'challenge:updated', {
            message: `Challenge "${challenge.name}" has been updated`,
            challenge,
          })
        } catch (error) {
          if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            callback({ error: 'an error occured' })
          }
        }
      },
    )

    adminSocket.on('challenge:actions:broke', async (challengeId: string) => {
      const updated = await updateChallenge(challengeId, { isBroken: true })
      gameIo.emit('challenge:updated', updated)
      adminIo.emit('challenge:updated', updated)
      await emitEventLog(gameIo, 'challenge:broken', {
        message: `Challenge "${updated.name}" is marked has broken, we are working to repair it, please try another challenge`,
        challenge: updated,
      })
    })

    adminSocket.on('challenge:actions:repair', async (challengeId: string) => {
      const updated = await updateChallenge(challengeId, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
      adminIo.emit('challenge:updated', updated)
      await emitEventLog(gameIo, 'challenge:repaired', {
        message: `Challenge "${updated.name}" is fixed, you can try to solve it again`,
        challenge: updated,
      })
    })

    adminSocket.on(
      'challenge:actions:delete',
      async (challengeId: string, callback: CallbackOrError<void>) => {
        const achievementCount = await countChallengeAchievement(challengeId)

        if (achievementCount > 0) {
          callback({
            error: 'You cannot delete a challenge with achievements',
          })
          return
        }

        const deleted = await removeChallenge(challengeId)
        if (!deleted) {
          return
        }

        gameIo.emit('challenge:deleted', deleted)
        adminIo.emit('challenge:deleted', deleted)
        await emitEventLog(gameIo, 'challenge:deleted', {
          message: `Challenge "${deleted.name}" has been deleted`,
          challenge: deleted,
        })
        callback()
      },
    )

    adminSocket.on('game:actions:end', async () => {
      await serverConfig.setGameOpened(false)
      await emitGameConfigUpdate()

      for (const [, soc] of playerIo.sockets) {
        const req = soc.request as Request
        if (req.user) {
          logout(req.user.username)
        }
        req.logOut(() => {
          soc.disconnect(true)
        })
      }

      serverStatFetcher.stop()

      await emitEventLog(gameIo, 'game:ended', {
        message: `Game is now closed. Thanks for your participation`,
        serverConfig,
      })
    })

    adminSocket.on(
      'game:activity',
      (callback: Callback<ServerActivityStatistics>) => {
        const statistics = getServerActivityStatistics(
          adminIo,
          gameIo,
          playerIo,
        )
        callback(statistics)
      },
    )

    adminSocket.on(
      'game:activity:list',
      async (callback: Callback<TimestampedServerActivityStatistics[]>) => {
        const statistics = await listServerActivityStatistics()
        callback(statistics)
      },
    )

    adminSocket.on('game:actions:open', async () => {
      await serverConfig.setGameOpened(true)
      await emitGameConfigUpdate()

      serverStatFetcher.start()

      await emitEventLog(gameIo, 'game:opened', {
        message: `Game is now opened. Good luck to everyone`,
      })
    })

    adminSocket.on('game:actions:openRegistration', async () => {
      await serverConfig.setRegistrationClosed(false)
      await emitGameConfigUpdate()
    })

    adminSocket.on('game:actions:closeRegistration', async () => {
      await serverConfig.setRegistrationClosed(true)
      await emitGameConfigUpdate()
    })

    adminSocket.on('game:actions:setTeamSize', async (teamSize: number) => {
      await serverConfig.setTeamSize(teamSize)
      await emitGameConfigUpdate()
    })

    adminSocket.on(
      'game:annoucement:actions:sendMessage',
      async (message: string, challengeId?: string) => {
        const chall = challengeId ? await getChallenge(challengeId) : undefined

        const result = await addMessage({
          content: message,
          challengeId: chall?._id,
        })

        gameIo.emit('game:announcement:made', result)

        await emitEventLog(gameIo, 'game:announcement:made', {
          message: chall?._id
            ? `A new hint from the staff has been shared`
            : `A new message from the staff has been shared`,
          messageSend: message,
          challenge: chall,
        })
      },
    )

    adminSocket.on('users:list', async (callback: Callback<User[]>) => {
      const users = await listUser()
      callback(users)
    })

    adminSocket.on(
      'users:actions:changeTeam',
      async (username: string, team: string, callback: Callback<User>) => {
        const user = await updateUser(username, { team })
        callback(user)
      },
    )

    adminSocket.on(
      'users:actions:changePassword',
      async (username: string, password: string, callback: Callback<User>) => {
        const user = await updateUser(username, { password })
        callback(user)
      },
    )

    adminSocket.on(
      'users:actions:changeRoles',
      async (username: string, roles: UserRole[], callback: Callback<User>) => {
        const user = roles.includes(UserRole.Admin)
          ? await updateUser(username, {
              roles: roles.filter(r => r !== UserRole.Player),
              team: 'admin',
            })
          : await updateUser(username, { roles })

        adminIo.in(user.username).disconnectSockets(true)

        callback(user)
      },
    )

    adminSocket.on(
      'users:actions:delete',
      async (username: string, callback: Callback<void>) => {
        await removeUser(username)
        logout(username)
        callback()
      },
    )

    adminSocket.on('users:actions:logout', logout)

    adminSocket.on(
      'achievement:actions:delete',
      async (teamname: string, challengeId: string) => {
        const deleted = await removeAchievement(teamname, challengeId)

        if (deleted) {
          gameIo.emit('achievement:deleted', deleted)
        }
      },
    )

    adminSocket.on('reward:actions:delete', async (id: string) => {
      const deleted = await removeReward(id)

      if (deleted) {
        gameIo.emit('reward:deleted', deleted)
      }
    })

    adminSocket.on('attempt:list', async (callback: Callback<Attempt[]>) => {
      const gameOpen = await serverConfig.getGameOpened()
      const attempt = await listAttempt({ nolimit: !gameOpen })
      callback(attempt)
    })

    adminSocket.on(
      'challenge:actions:file:upload',
      async (file: FileContent, callback: Callback<string>) => {
        const name = getFileName(file)
        await createFile({ ...file, name })
        callback('/api/content/' + name)
      },
    )

    async function emitGameConfigUpdate() {
      const updatedConfig = await serverConfig.getGameConfig()
      gameIo.emit('game:config:updated', updatedConfig)
    }

    function logout(username: string) {
      playerIo.in(username).disconnectSockets(true)
      gameIo.in(username).disconnectSockets(true)
      adminSocket.in(username).disconnectSockets(true)
    }
  })
}

function getFileName(file: FileContent) {
  return (
    createHash('sha256').update(file.content).digest('hex') + extname(file.name)
  )
}
