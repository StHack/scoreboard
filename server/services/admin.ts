import { removeAchievement } from 'db/AchievementDb'
import { listAttempt } from 'db/AttemptDb'
import {
  createChallenge,
  listChallenge,
  updateChallenge,
} from 'db/ChallengeDb'
import { addMessage } from 'db/MessageDb'
import { createReward, removeReward } from 'db/RewardDb'
import { listUser, removeUser, updateUser } from 'db/UsersDb'
import debug from 'debug'
import { Request } from 'express'
import { BaseChallenge } from 'models/Challenge'
import { BaseReward } from 'models/Reward'
import { User } from 'models/User'
import { Namespace } from 'socket.io'
import {
  getServerActivityStatistics,
  registerSocketConnectivityChange,
} from './serveractivity'
import { ServerConfig } from './serverconfig'

export function registerAdminNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
) {
  const logger = debug('sthack:admin')

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

    adminSocket.on('challenge:list', async callback => {
      const challenges = await listChallenge()
      callback(challenges)
    })

    adminSocket.on(
      'challenge:create',
      async (chall: BaseChallenge, callback) => {
        try {
          const challenge = await createChallenge(chall)
          callback(challenge)
          gameIo.emit('challenge:added', challenge)
          adminSocket.emit('challenge:added', challenge)
        } catch (error) {
          if (error instanceof Error) {
            callback({ error: error.message })
          } else {
            callback({ error: 'an error occured' })
          }
        }
      },
    )

    adminSocket.on('reward:create', async (reward: BaseReward, callback) => {
      try {
        const rewardCreated = await createReward(reward)
        callback(rewardCreated)
        gameIo.emit('reward:added', rewardCreated)
      } catch (error) {
        if (error instanceof Error) {
          callback({ error: error.message })
        } else {
          callback({ error: 'an error occured' })
        }
      }
    })

    adminSocket.on(
      'challenge:update',
      async (challengeId: string, chall: BaseChallenge, callback) => {
        try {
          const challenge = await updateChallenge(challengeId, chall)
          callback(challenge)
          gameIo.emit('challenge:updated', challenge)
          adminSocket.emit('challenge:updated', challenge)
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
    })

    adminSocket.on('challenge:repair', async (challengeId: string) => {
      const updated = await updateChallenge(challengeId, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
      adminSocket.emit('challenge:updated', updated)
    })

    adminSocket.on('game:end', async () => {
      await serverConfig.setGameOpened(false)
      await emitGameConfigUpdate()

      for (const [id, soc] of playerIo.sockets) {
        const req = soc.request as Request
        req.user && logout(req.user.username)
        req.logOut(err => {
          soc.disconnect(true)
        })
      }
    })

    adminSocket.on('game:activity', async callback => {
      const statistics = getServerActivityStatistics(adminIo, gameIo, playerIo)
      callback(statistics)
    })

    adminSocket.on('game:open', async () => {
      await serverConfig.setGameOpened(true)
      await emitGameConfigUpdate()
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
      },
    )

    adminSocket.on('users:list', async callback => {
      const users = await listUser()
      callback(users)
    })

    adminSocket.on(
      'users:changeTeam',
      async (username: string, team: string, callback) => {
        const user = await updateUser(username, { team })
        callback(user)
      },
    )

    adminSocket.on(
      'users:changePassword',
      async (username: string, password: string, callback) => {
        const user = await updateUser(username, { password })
        callback(user)
      },
    )

    adminSocket.on(
      'users:changeIsAdmin',
      async (username: string, isAdmin: boolean, callback) => {
        const user = isAdmin
          ? await updateUser(username, { isAdmin: true, team: 'admin' })
          : await updateUser(username, { isAdmin: false })

        adminIo.in(user.username).disconnectSockets(true)

        callback(user)
      },
    )

    adminSocket.on('users:delete', async (username: string, callback) => {
      await removeUser(username)
      logout(username)
      callback()
    })

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

    adminSocket.on('attempt:list', async callback => {
      const attempt = await listAttempt()
      callback(attempt)
    })

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
