import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { GameConfig } from 'models/GameConfig'
import { ChallengeScore, GameScore } from 'models/GameScore'
import { User } from 'models/User'

export function computeGameScore (
  achievements: Achievement[],
  challenges: Challenge[],
  config: GameConfig,
  user: User,
): GameScore {
  const challSolvation = achievements.reduce<Record<string, Achievement[]>>(
    (dic, achievement) => ({
      ...dic,
      [achievement.challenge]: [
        ...(dic[achievement.challenge] ?? []),
        achievement,
      ],
    }),
    {},
  )

  let teamScore = 0
  let myScore = 0

  if (challenges.length && achievements.length) {
    teamScore = achievements
      .filter(a => a.teamname === user.team)
      .map(a =>
        computeScore(
          challenges.find(c => c.name === a.challenge)!,
          config,
          challSolvation[a.challenge]?.length,
        ),
      )
      .reduce((p, c) => p + c, 0)

    myScore = achievements
      .filter(a => a.username === user.username)
      .map(a =>
        computeScore(
          challenges.find(c => c.name === a.challenge)!,
          config,
          challSolvation[a.challenge]?.length,
        ),
      )
      .reduce((p, c) => p + c, 0)
  }

  return {
    teamScore,
    myScore,
    challScore: challenges.reduce<Record<string, ChallengeScore>>(
      (p, c) => ({
        ...p,
        [c.name]: {
          score: computeScore(c, config, challSolvation[c.name]?.length ?? 0),
          lastSolved: challSolvation[c.name]
            ?.map(cc => cc.createdAt)
            .reduce((a, b) => (a > b ? a : b)),
          solvedBy: achievements.find(
            a => a.teamname === user.team && a.challenge === c.name,
          )?.username,
        },
      }),
      {},
    ),
  }
}

export function computeScore (
  challenge: Challenge,
  config: GameConfig,
  solvedCount: number = 0,
): number {
  return (
    config.baseChallScore *
    DifficultyValue[challenge.difficulty] *
    (config.teamCount - solvedCount)
  )
}

const DifficultyValue: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
}
