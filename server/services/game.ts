import { Namespace } from 'socket.io'
import { listChallenge } from 'db/ChallengeDb'

export function registerGameNamespace(gameIo: Namespace) {
  gameIo.on('connection', gameSocket => {
    gameSocket.on('challenge:list', async callback => {
      const challenges = await listChallenge()
      callback(challenges)
    })
  })
}
