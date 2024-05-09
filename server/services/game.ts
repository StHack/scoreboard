import {
  Achievement,
  Callback,
  Challenge,
  GameConfig,
  Message,
  Reward,
} from '@sthack/scoreboard-common'
import { listAchievement } from 'db/AchievementDb.js'
import { listChallenge } from 'db/ChallengeDb.js'
import { listMessage } from 'db/MessageDb.js'
import { listReward } from 'db/RewardDb.js'
import { listTeam } from 'db/UsersDb.js'
import { Namespace } from 'socket.io'
import { registerSocketConnectivityChange } from './serveractivity.js'
import { ServerConfig } from './serverconfig.js'

export function registerGameNamespace(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
  serverConfig: ServerConfig,
) {
  gameIo.on('connection', gameSocket => {
    registerSocketConnectivityChange(gameSocket, adminIo, gameIo, playerIo)

    gameSocket.on('challenge:list', async (callback: Callback<Challenge[]>) => {
      const challenges = await listChallenge()

      const gameOpened = await serverConfig.getGameOpened()

      callback(
        gameOpened
          ? challenges.map(c => (c.isBroken ? { ...c, description: '' } : c))
          : challenges.map(c => ({ ...c, description: '' })),
      )
    })

    gameSocket.on(
      'achievement:list',
      async (callback: Callback<Achievement[]>) => {
        const achievements = await listAchievement()
        callback(achievements)
      },
    )

    gameSocket.on('reward:list', async (callback: Callback<Reward[]>) => {
      const rewards = await listReward()
      callback(rewards)
    })

    gameSocket.on('game:config', async (callback: Callback<GameConfig>) => {
      const result = await serverConfig.getGameConfig()
      callback(result)
    })

    gameSocket.on('game:messages', async (callback: Callback<Message[]>) => {
      const messages = await listMessage()
      callback(messages)
    })

    gameSocket.on('game:teams', async (callback: Callback<string[]>) => {
      const teams = await listTeam()
      callback(teams)
    })
  })
}
