import { Achievement } from '../models/Achievement.js'
import { Challenge } from '../models/Challenge.js'
import { GameConfig } from '../models/GameConfig.js'
import { ChallengeScore, GameScore, TeamScore } from '../models/GameScore.js'
import { Reward } from '../models/Reward.js'

export function computeGameScore(
  achievements: Achievement[],
  rewards: Reward[],
  challenges: Challenge[],
  teams: string[],
  config: GameConfig,
): GameScore {
  const challsScore = computeChallenges(challenges, achievements, config)
  const teamsScore = computeTeams(teams, challsScore, rewards, config)

  return {
    challsScore,
    teamsScore,
  }
}
function computeChallenges(
  challenges: Challenge[],
  achievements: Achievement[],
  config: GameConfig,
): Record<string, ChallengeScore> {
  return challenges.reduce<Record<string, ChallengeScore>>(
    (agg, challenge) => ({
      ...agg,
      [challenge._id]: computeChallenge(achievements, challenge, config),
    }),
    {},
  )
}

function computeChallenge(
  achievements: Achievement[],
  challenge: Challenge,
  config: GameConfig,
): ChallengeScore {
  const a = achievements
    .filter(a => a.challengeId === challenge._id)
    .sort((x, y) => x.createdAt.getTime() - y.createdAt.getTime())

  return {
    challenge,
    score: computeChallengeScore(challenge, config, a.length),
    achievements: a,
  }
}

function computeTeams(
  teams: string[],
  challsScore: Record<string, ChallengeScore>,
  rewards: Reward[],
  config: GameConfig,
): TeamScore[] {
  return teams
    .map(t => computeTeam(challsScore, t, rewards, config))
    .sort((a, b) => b.score - a.score)
    .map((ts, i, tss) => ({
      ...ts,
      rank: tss.findIndex(x => x.score === ts.score) + 1,
    }))
}

function computeTeam(
  challsScore: Record<string, ChallengeScore>,
  team: string,
  rewards: Reward[],
  config: GameConfig,
): TeamScore {
  const challengeResolved = Object.values(challsScore).filter(cs =>
    cs.achievements.find(a => a.teamname === team),
  )
  const rewardAcquired = rewards.filter(r => r.teamname === team)
  return {
    rank: 0,
    team,
    score: computeTeamScore(challengeResolved, rewardAcquired, config),
    breakthroughs: challengeResolved
      .map(cs => cs.achievements[0] ?? ({ teamname: '' } as Achievement))
      .filter(a => a.teamname === team),
    solved: challengeResolved
      .flatMap(cs => cs.achievements)
      .filter(a => a.teamname === team),
    rewards: rewardAcquired,
  }
}

function computeTeamScore(
  challsScore: ChallengeScore[],
  rewards: Reward[],
  config: GameConfig,
): number {
  return (
    challsScore.reduce((agg, cs) => agg + cs.score, 0) +
    rewards
      .map(r => computeRewardScore(r, config))
      .reduce((acc, cur) => acc + cur, 0)
  )
}

function computeChallengeScore(
  challenge: Challenge,
  config: GameConfig,
  solvedCount: number = 0,
): number {
  return config.baseChallScore * (config.teamCount - solvedCount)
}

function computeRewardScore(reward: Reward, config: GameConfig): number {
  return reward.value
}
