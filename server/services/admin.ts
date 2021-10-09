import { Request } from 'express'
import { Namespace } from 'socket.io'
import { User } from 'models/User'
import { BaseChallenge } from 'models/Challenge'
import { closeAllChallenge, createChallenge, updateChallenge } from 'db/ChallengeDb'

export function registerAdminNamespace(adminIo: Namespace, gameIo: Namespace) {
  adminIo.use((socket, next) =>
    (socket.request as Request<User>).user?.isAdmin ? next() : next(new Error('unauthorized')),
  )

  adminIo.on('connection', adminSocket => {
    adminSocket.on('challenge:create', async (chall: BaseChallenge, callback) => {
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
    })

    adminSocket.on('challenge:update', async (challName: string, chall: BaseChallenge, callback) => {
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
    })

    adminSocket.on('challenge:broke', async (challName: string) => {
      const updated = await updateChallenge(challName, { isBroken: true })
      gameIo.emit('challenge:updated', updated)
    })

    adminSocket.on('challenge:repair', async (challName: string) => {
      const updated = await updateChallenge(challName, { isBroken: false })
      gameIo.emit('challenge:updated', updated)
    })

    // adminSocket.on('game:end', async () => {
    //   await closeAllChallenge()
    //   gameIo.disconnectSockets()
    // })
  })
}
