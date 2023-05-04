import { removeAchievement } from 'db/AchievementDb'
import {
  closeAllChallenge,
  createChallenge,
  listChallenge,
  openAllChallenge,
  updateChallenge,
} from 'db/ChallengeDb'
import { addMessage } from 'db/MessageDb'
import { listUser, removeUser, updateUser } from 'db/UsersDb'
import debug from 'debug'
import { Request } from 'express'
import { BaseChallenge } from 'models/Challenge'
import { User } from 'models/User'
import { Namespace } from 'socket.io'
import { ServerConfig } from './serverconfig'
import { listAttempt } from 'db/AttemptDb'

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

    adminSocket.on(
      'challenge:update',
      async (challName: string, chall: BaseChallenge, callback) => {
        try {
          const challenge = await updateChallenge(challName, chall)
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

    adminSocket.on('challenge:broke', async (challName: string) => {
      const updated = await updateChallenge(challName, { isBroken: true })
      gameIo.emit('challenge:updated', updated)
      adminSocket.emit('challenge:updated', updated)
    })

    adminSocket.on('challenge:repair', async (challName: string) => {
      const updated = await updateChallenge(challName, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
      adminSocket.emit('challenge:updated', updated)
    })

    adminSocket.on('game:end', async () => {
      await closeAllChallenge()
      await serverConfig.setGameOpened(false)

      for (const [id, soc] of playerIo.sockets) {
        const req = soc.request as Request
        req.logOut(err => {
          soc.disconnect(true)
        })
      }

      gameIo.emit('game:ended')
    })

    adminSocket.on('game:open', async () => {
      await openAllChallenge()
      await serverConfig.setGameOpened(true)
    })

    adminSocket.on('game:openRegistration', async () => {
      await serverConfig.setRegistrationClosed(false)
    })

    adminSocket.on('game:closeRegistration', async () => {
      await serverConfig.setRegistrationClosed(true)
    })

    adminSocket.on('game:setTeamSize', async (teamSize: number) => {
      await serverConfig.setTeamSize(teamSize)
      const updatedConfig = await serverConfig.getGameConfig()
      gameIo.emit('game:config:updated', updatedConfig)
    })

    adminSocket.on(
      'game:sendMessage',
      async (message: string, challenge?: string) => {
        const result = await addMessage({ content: message, challenge })

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

      gameIo.in(username).disconnectSockets()
      adminSocket.in(username).disconnectSockets()
      callback()
    })

    adminSocket.on(
      'achievement:delete',
      async (teamname: string, challenge: string) => {
        const deleted = await removeAchievement(teamname, challenge)

        if (deleted) {
          gameIo.emit('achievement:deleted', deleted)
        }
      },
    )

    adminSocket.on('attempt:list', async callback => {
      const attempt = await listAttempt()
      callback(attempt)
    })
  })
}
