import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { GameConfig } from 'models/GameConfig'
import { User } from 'models/User'

export type GameScore = {
  teamScore: number
  myScore: number
  challScore: Record<string, number>
}

export function computeGameScore (
  achievements: Achievement[],
  challenges: Challenge[],
  config: GameConfig,
  user: User,
): GameScore {
  const challSolvation = achievements.reduce<Record<string, number>>(
    (dic, achievement) => ({
      ...dic,
      [achievement.challenge]: (dic[achievement.challenge] ?? 0) + 1,
    }),
    {},
  )

  const teamScore = achievements
    .filter(a => a.teamname === user.team)
    .map(a =>
      computeScore(
        challenges.find(c => c.name === a.challenge)!,
        config,
        challSolvation[a.challenge],
      ),
    )
    .reduce((p, c) => p + c, 0)

  const myScore = achievements
    .filter(a => a.username === user.username)
    .map(a =>
      computeScore(
        challenges.find(c => c.name === a.challenge)!,
        config,
        challSolvation[a.challenge],
      ),
    )
    .reduce((p, c) => p + c, 0)

  return {
    teamScore,
    myScore,
    challScore: challenges.reduce<Record<string, number>>(
      (p, c) => ({
        ...p,
        [c.name]: computeScore(c, config, challSolvation[c.name] ?? 0),
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
