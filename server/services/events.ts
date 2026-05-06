import {
  Achievement,
  BaseAttempt,
  Challenge,
  computeGameScore,
  computeRewardScore,
  Reward,
  TeamScore,
} from '@sthack/scoreboard-common'
import { listAchievement } from 'db/AchievementDb.js'
import { listChallenge } from 'db/ChallengeDb.js'
import { listReward } from 'db/RewardDb.js'
import { listTeam } from 'db/UsersDb.js'
import debug from 'debug'
import { Namespace } from 'socket.io'
import { setTimeout } from 'timers/promises'
import { sendMessageToDiscord } from './discord.js'
import { ServerConfig } from './serverconfig.js'

const logger = debug('sthack:events')

export async function emitEventLog(
  gameIo: Namespace,
  type: string,
  { message, ...options }: { message: string } & Record<string, unknown>,
): Promise<void> {
  gameIo.emit('events:happen', { type, message })

  const handler = discordFormatHandler.find(([name]) => name === type)
  if (!handler) {
    logger('%s\t%s', type, 'handler not found')
    return
  }

  const [, func] = handler

  if (typeof func === 'string') {
    await sendMessageToDiscord(func)
    return
  }

  if (typeof func === 'function') {
    const content = await func(options)
    if (Array.isArray(content)) {
      for (const txt of content) {
        await sendMessageToDiscord(txt)
        await setTimeout(200)
      }
    } else if (content) {
      await sendMessageToDiscord(content)
    }

    return
  }

  await sendMessageToDiscord(message)
}

const discordFormatHandler: [
  string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (string | ((options: any) => Promise<string | string[]>))?,
][] = [
  ['game:opened', '# 🏴‍☠️ CTF is now open'],
  ['game:ended', gameEnd],
  ['reward:added', reward],
  ['challenge:solved', solve],
  ['challenge:broken'],
  ['challenge:repaired'],
  ['player:attempted', attempt],
  ['game:announcement:made', sendMessage],
]

async function gameEnd(options: {
  serverConfig: ServerConfig
}): Promise<string[]> {
  const serverConfig = options.serverConfig

  const [achievements, rewards, challenges, teams, config] = await Promise.all([
    listAchievement(),
    listReward(),
    listChallenge(),
    listTeam(),
    serverConfig.getGameConfig(),
  ])

  const gameScore = computeGameScore(
    achievements,
    rewards,
    challenges,
    teams,
    config,
  )

  const scoreboard = tableToMarkdown(
    config.isNoCompetition
      ? [
          { name: '🏆', maxLength: 2, extract: ts => ts.rewards.length },
          { name: '💥', maxLength: 2, extract: ts => ts.breakthroughs.length },
          { name: '🚩', maxLength: 3, extract: ts => ts.solved.length },
          { name: 'Team', extract: ts => ts.team },
        ]
      : [
          { name: '#', maxLength: 3, extract: ts => ts.rank },
          { name: 'Score', maxLength: 6, extract: ts => ts.score },
          { name: '🏆', maxLength: 2, extract: ts => ts.rewards.length },
          { name: '💥', maxLength: 2, extract: ts => ts.breakthroughs.length },
          { name: '🚩', maxLength: 3, extract: ts => ts.solved.length },
          { name: 'Team', extract: ts => ts.team },
        ],
    gameScore.teamsScore,
  )

  const challBoard = tableToMarkdown(
    config.isNoCompetition
      ? [
          { name: '💥', maxLength: 3, extract: cs => cs.achievements.length },
          { name: 'Challenge', extract: cs => cs.challenge.name },
        ]
      : [
          { name: '💥', maxLength: 3, extract: cs => cs.achievements.length },
          { name: 'Score', maxLength: 6, extract: cs => cs.score },
          { name: 'Challenge', extract: cs => cs.challenge.name },
        ],
    Object.values(gameScore.challsScore).sort(
      (cs1, cs2) => cs2.achievements.length - cs1.achievements.length,
    ),
  )

  return [
    '# 🏴‍☠️ CTF is now closed',
    scoreboard && `## Teams Scoreboard\n\`\`\`${scoreboard}\`\`\``,
    challBoard && `## Challenges Scoreboard\n\`\`\`${challBoard}\`\`\``,
  ].filter(str => str)
}

type tableToMarkdownDefinition<T> = {
  name: string
  maxLength?: number
  extract: (obj: T) => string | number | undefined
}

function tableToMarkdown<T>(
  definition: tableToMarkdownDefinition<T>[],
  data: T[],
): string {
  if (data.length === 0) {
    return ''
  }

  return (
    '|' +
    [
      definition
        .map(def => def.name.slice(0, def.maxLength).padEnd(def.maxLength ?? 0))
        .join(' | '),
      ...data.map(obj =>
        definition
          .map(def =>
            (def.extract(obj) || ' ')
              .toString()
              .slice(0, def.maxLength)
              .padStart(def.maxLength ?? 0),
          )
          .join(' | '),
      ),
    ].join('\n|')
  )
}

async function reward({
  reward,
  serverConfig,
}: {
  reward: Reward
  serverConfig: ServerConfig
}): Promise<string> {
  const gameConfig = await serverConfig.getGameConfig()
  const currentValue = computeRewardScore(reward, gameConfig)
  const { teamname, value, label } = reward
  const baseWording = `## 🏆 Reward \`${label}\` has been given!`
  return gameConfig.isNoCompetition
    ? baseWording
    : `${baseWording}\nto team \`${teamname}\` with a base value of \`${value}\`pts which correspond to \`${currentValue}\`pts with the current team count`
}

function solve({
  isBreakthrough,
  achievement,
  challenge,
}: {
  isBreakthrough: boolean
  achievement: Achievement
  challenge: Challenge
}): Promise<string> {
  if (!isBreakthrough) {
    return Promise.resolve('')
  }

  const { username, teamname } = achievement
  const { name } = challenge

  return Promise.resolve(
    `## 💥 Breakthrough on challenge \`${name}\`!\n\`${username}\` from team \`${teamname}\` just solved it`,
  )
}

function attempt({
  attempt,
  challenge: { name },
}: {
  attempt: BaseAttempt
  challenge: Challenge
}): Promise<string> {
  return Promise.resolve(
    `## ⚠️ Bruteforce attempts on challenge \`${name}\`!\nTeam \`${attempt.teamname}\` has reach the warning threshold of attempts made`,
  )
}

function sendMessage({
  messageSend,
  challenge,
}: {
  messageSend: string
  challenge?: Challenge
}): Promise<string> {
  const title = challenge
    ? `A new hint from the staff has been shared for challenge \`${challenge.name}\`!`
    : `A new message from the staff has been shared`

  return Promise.resolve(`## 📣 ${title}\n\n${messageSend}`)
}
