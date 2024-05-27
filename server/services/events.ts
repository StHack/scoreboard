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
  ['game:open', '# 🏴‍☠️ CTF is now open'],
  ['game:end', gameEnd],
  ['reward:create', reward],
  ['challenge:solve', solve],
  ['challenge:broke'],
  ['challenge:repair'],
  ['player:attempt', attempt],
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

  const scoreboardRow = (ts: TeamScore) => {
    return (
      '|' +
      [
        ts.rank.toString().padStart(3),
        ts.score.toString().padStart(6),
        (ts.rewards.length || ' ').toString().padStart(2),
        (ts.breakthroughs.length || ' ').toString().padStart(2),
        ts.solved.length.toString().padStart(3),
        ts.team,
      ]
        .filter(str => str)
        .join(' | ')
    )
  }

  const scoreboard = gameScore.teamsScore
    .filter(ts => ts.score > 0)
    .map(scoreboardRow)
    .join('\n')
  const unScorers = gameScore.teamsScore
    .filter(ts => ts.score === 0)
    .map(ts => `- ${ts.team}`)
    .join('\n')

  const challBoard = Object.values(gameScore.challsScore)
    .filter(cs => cs.achievements.length > 0)
    .sort((cs1, cs2) => cs2.achievements.length - cs1.achievements.length)
    .map(
      cs =>
        '|' +
        [
          cs.achievements.length.toString().padStart(3),
          cs.score.toString().padStart(6),
          cs.challenge.name,
        ]
          .filter(str => str)
          .join(' | '),
    )
    .join('\n')

  const unresolvedChalls = Object.values(gameScore.challsScore)
    .filter(cs => cs.achievements.length === 0)
    .map(cs => `- ${cs.challenge.name}`)
    .join('\n')

  return [
    '# 🏴‍☠️ CTF is now closed',
    scoreboard &&
      `## Teams Scoreboard\n\`\`\`|  # | Score  | 🏆 | 💥 | 🚩  | Team\n${scoreboard}\`\`\``,
    unScorers && `## Teams who hasn't scored\n\`\`\`${unScorers}\`\`\``,
    challBoard &&
      `## Challenges Scoreboard\n\`\`\`| 💥 | Score  | Challenge\n${challBoard}\`\`\``,
    unresolvedChalls &&
      `## Challenges unresolved\n\`\`\`${unresolvedChalls}\`\`\``,
  ].filter(str => str)
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
  return `## 🏆 Reward \`${label}\` has been given!\nto team \`${teamname}\` with a base value of \`${value}\`pts which correspond to \`${currentValue}\`pts with the current team count`
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
