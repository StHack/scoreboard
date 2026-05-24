import {
  Achievement,
  Callback,
  Challenge,
  GameConfig,
  Message,
  Reward,
  Survey,
  Team,
} from '@sthack/scoreboard-common'
import { listAchievement } from 'db/AchievementDb.js'
import { listChallenge } from 'db/ChallengeDb.js'
import { listMessage } from 'db/MessageDb.js'
import { listReward } from 'db/RewardDb.js'
import { listSurvey } from 'db/SurveyDb.js'
import { listTeam } from 'db/TeamDb.js'
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

      callback(challenges.map(mapAsPublicChallenge({ gameOpened })))
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

    gameSocket.on('game:teams', async (callback: Callback<Team[]>) => {
      const teams = await listTeam()
      callback(teams)
    })

    gameSocket.on('surveys:list', async (callback: Callback<Survey[]>) => {
      const achievements = await listSurvey()
      callback(achievements)
    })
  })
}

export const mapAsPublicChallenge =
  (config: { gameOpened?: boolean } = {}) =>
  (challenge: Challenge) => {
    const cleanDescription = () =>
      !config.gameOpened || challenge.isBroken ? '' : challenge.description

    const cleanToken = () =>
      challenge.token
        ? {
            ...challenge.token,
            adminApiKey: '',
          }
        : undefined

    return {
      ...challenge,
      description: cleanDescription(),
      token: cleanToken(),
    } satisfies Challenge
  }
