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
} from '@sthack/scoreboard-common'
import { createHash } from 'crypto'
import { removeAchievement } from 'db/AchievementDb.js'
import { listAttempt } from 'db/AttemptDb.js'
import {
  createChallenge,
  listChallenge,
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
  getServerActivityStatistics,
  registerSocketConnectivityChange,
} from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'
import { ServerStatisticsFetcher } from './serverStatistics.js'

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

  adminIo.use((socket, next) => {
    const user = (socket.request as Request<User>).user

    if (user?.isAdmin) {
      next()
    } else {
      logger(
        '%s\t%s\tattempt admin path',
        socket.conn.transport.sid,
        user?.username,
      )

      next(new Error('unauthorized'))
    }
  })

  adminIo.on('connection', adminSocket => {
    adminSocket.use(([event, ...args], next) => {
      logger(
        '%s\t%s\t%s\t%o',
        adminSocket.conn.transport.sid,
        (adminSocket.request as Request<User>).user?.username,
        event,
        args,
      )
      next()
    })

    registerSocketConnectivityChange(adminSocket, adminIo, gameIo, playerIo)

    adminSocket.on(
      'challenge:list',
      async (callback: Callback<Challenge[]>) => {
        const challenges = await listChallenge()
        callback(challenges)
      },
    )

    adminSocket.on(
      'challenge:create',
      async (chall: BaseChallenge, callback: CallbackOrError<Challenge>) => {
        try {
          const challenge = await createChallenge(chall)
          callback(challenge)
          gameIo.emit('challenge:added', challenge)
          adminSocket.emit('challenge:added', challenge)
          await emitEventLog(gameIo, 'challenge:create', {
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
      'reward:create',
      async (reward: BaseReward, callback: CallbackOrError<Reward>) => {
        try {
          const rewardCreated = await createReward(reward)
          callback(rewardCreated)
          gameIo.emit('reward:added', rewardCreated)
          await emitEventLog(gameIo, 'reward:create', {
            message: `A reward has been given to team "${rewardCreated.teamname}" for ${rewardCreated.value.toString()} points`,
            reward: rewardCreated,
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
      'challenge:update',
      async (
        challengeId: string,
        chall: BaseChallenge,
        callback: CallbackOrError<Challenge>,
      ) => {
        try {
          const challenge = await updateChallenge(challengeId, chall)
          callback(challenge)
          gameIo.emit('challenge:updated', challenge)
          adminSocket.emit('challenge:updated', challenge)
          await emitEventLog(gameIo, 'challenge:update', {
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

    adminSocket.on('challenge:broke', async (challengeId: string) => {
      const updated = await updateChallenge(challengeId, { isBroken: true })
      gameIo.emit('challenge:updated', updated)
      adminSocket.emit('challenge:updated', updated)
      await emitEventLog(gameIo, 'challenge:broke', {
        message: `Challenge "${updated.name}" is marked has broken, we are working to repair it, please try another challenge`,
        challenge: updated,
      })
    })

    adminSocket.on('challenge:repair', async (challengeId: string) => {
      const updated = await updateChallenge(challengeId, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
      adminSocket.emit('challenge:updated', updated)
      await emitEventLog(gameIo, 'challenge:repair', {
        message: `Challenge "${updated.name}" is fixed, you can try to solve it again`,
        challenge: updated,
      })
    })

    adminSocket.on('game:end', async () => {
      await serverConfig.setGameOpened(false)
      await emitGameConfigUpdate()

      for (const [, soc] of playerIo.sockets) {
        const req = soc.request as Request
        req.user && logout(req.user.username)
        req.logOut(() => {
          soc.disconnect(true)
        })
      }

      serverStatFetcher.stop()

      await emitEventLog(gameIo, 'game:end', {
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

    adminSocket.on('game:open', async () => {
      await serverConfig.setGameOpened(true)
      await emitGameConfigUpdate()

      serverStatFetcher.start()

      await emitEventLog(gameIo, 'game:open', {
        message: `Game is now opened. Good luck to everyone`,
      })
    })

    adminSocket.on('game:openRegistration', async () => {
      await serverConfig.setRegistrationClosed(false)
      await emitGameConfigUpdate()
    })

    adminSocket.on('game:closeRegistration', async () => {
      await serverConfig.setRegistrationClosed(true)
      await emitGameConfigUpdate()
    })

    adminSocket.on('game:setTeamSize', async (teamSize: number) => {
      await serverConfig.setTeamSize(teamSize)
      await emitGameConfigUpdate()
    })

    adminSocket.on(
      'game:sendMessage',
      async (message: string, challengeId?: string) => {
        const result = await addMessage({ content: message, challengeId })

        gameIo.emit('game:newMessage', result)

        await emitEventLog(gameIo, 'game:sendMessage', {
          message: challengeId
            ? `A new hint from the staff has been shared`
            : `A new message from the staff has been shared`,
          messageSend: message,
          challengeId,
        })
      },
    )

    adminSocket.on('users:list', async (callback: Callback<User[]>) => {
      const users = await listUser()
      callback(users)
    })

    adminSocket.on(
      'users:changeTeam',
      async (username: string, team: string, callback: Callback<User>) => {
        const user = await updateUser(username, { team })
        callback(user)
      },
    )

    adminSocket.on(
      'users:changePassword',
      async (username: string, password: string, callback: Callback<User>) => {
        const user = await updateUser(username, { password })
        callback(user)
      },
    )

    adminSocket.on(
      'users:changeIsAdmin',
      async (username: string, isAdmin: boolean, callback: Callback<User>) => {
        const user = isAdmin
          ? await updateUser(username, { isAdmin: true, team: 'admin' })
          : await updateUser(username, { isAdmin: false })

        adminIo.in(user.username).disconnectSockets(true)

        callback(user)
      },
    )

    adminSocket.on(
      'users:delete',
      async (username: string, callback: Callback<void>) => {
        await removeUser(username)
        logout(username)
        callback()
      },
    )

    adminSocket.on('users:logout', logout)

    adminSocket.on(
      'achievement:delete',
      async (teamname: string, challengeId: string) => {
        const deleted = await removeAchievement(teamname, challengeId)

        if (deleted) {
          gameIo.emit('achievement:deleted', deleted)
        }
      },
    )

    adminSocket.on('reward:delete', async (id: string) => {
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
      'file:upload',
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
