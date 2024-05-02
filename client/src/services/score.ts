import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { GameConfig } from 'models/GameConfig'
import { ChallengeScore, GameScore, TeamScore } from 'models/GameScore'
import { Reward } from 'models/Reward'

export function computeGameScore(
  achievements: Achievement[],
  rewards: Reward[],
  challenges: Challenge[],
  teams: string[],
  config: GameConfig,
): GameScore {
  const challsScore = computeChallsScore(challenges, achievements, config)
  const teamsScore = computeTeamsScore(teams, challsScore, rewards)

  return {
    challsScore,
    teamsScore,
  }
}
function computeChallsScore(
  challenges: Challenge[],
  achievements: Achievement[],
  config: GameConfig,
): Record<string, ChallengeScore> {
  return challenges.reduce<Record<string, ChallengeScore>>(
    (agg, challenge) => ({
      ...agg,
      [challenge._id]: computeChallengeScore(achievements, challenge, config),
    }),
    {},
  )
}

function computeChallengeScore(
  achievements: Achievement[],
  challenge: Challenge,
  config: GameConfig,
): ChallengeScore {
  const a = achievements
    .filter(a => a.challengeId === challenge._id)
    .sort((x, y) => x.createdAt.getTime() - y.createdAt.getTime())

  return {
    score: computeScore(challenge, config, a.length),
    achievements: a,
  }
}

function computeTeamsScore(
  teams: string[],
  challsScore: Record<string, ChallengeScore>,
  rewards: Reward[],
): TeamScore[] {
  return teams
    .map(t => computeTeamScore(challsScore, t, rewards))
    .sort((a, b) => b.score - a.score)
    .map((ts, i, tss) => ({
      ...ts,
      rank: tss.findIndex(x => x.score === ts.score) + 1,
    }))
}

function computeTeamScore(
  challsScore: Record<string, ChallengeScore>,
  team: string,
  rewards: Reward[],
): TeamScore {
  const rewardAcquired = rewards.filter(r => r.teamname === team)
  return {
    rank: 0,
    team,
    score:
      Object.values(challsScore)
        .filter(cs => cs.achievements.find(a => a.teamname === team))
        .reduce((agg, cs) => agg + cs.score, 0) +
      rewardAcquired.map(r => r.value).reduce((acc, cur) => acc + cur, 0),
    breakthroughs: Object.values(challsScore)
      .map(cs => cs.achievements[0] ?? {})
      .filter(a => a.teamname === team),
    solved: Object.values(challsScore)
      .flatMap(cs => cs.achievements)
      .filter(a => a.teamname === team),
    rewards: rewardAcquired,
  }
}

function computeScore(
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

export const DifficultyValue: Record<Difficulty, number> = {
  special: 0,
  easy: 1,
  medium: 2,
  hard: 3,
}
