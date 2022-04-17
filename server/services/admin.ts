import { removeAchievement } from 'db/AchievementDb'
import {
  closeAllChallenge,
  createChallenge,
  openAllChallenge,
  updateChallenge,
} from 'db/ChallengeDb'
import { addMessage } from 'db/MessageDb'
import { listUser, removeUser, updateUser } from 'db/UsersDb'
import { Request } from 'express'
import { BaseChallenge } from 'models/Challenge'
import { User } from 'models/User'
import { Namespace } from 'socket.io'
import { ServerConfig } from './serverconfig'

export function registerAdminNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
) {
  adminIo.use((socket, next) =>
    (socket.request as Request<User>).user?.isAdmin
      ? next()
      : next(new Error('unauthorized')),
  )

  adminIo.on('connection', adminSocket => {
    adminSocket.on(
      'challenge:create',
      async (chall: BaseChallenge, callback) => {
        try {
          const challenge = await createChallenge(chall)
          callback(challenge)
          gameIo.emit('challenge:added', challenge)
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
    })

    adminSocket.on('challenge:repair', async (challName: string) => {
      const updated = await updateChallenge(challName, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
    })

    adminSocket.on('game:end', async () => {
      await closeAllChallenge()
      await serverConfig.setGameOpened(false)

      for (const [id, soc] of playerIo.sockets) {
        const req = soc.request as Request
        req.logOut()
        soc.disconnect(true)
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

    adminSocket.on('game:sendMessage', async (message: string) => {
      const result = await addMessage({ content: message })

      gameIo.emit('game:newMessage', result)
    })

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
        const user = await updateUser(username, { isAdmin })
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
  })
}
