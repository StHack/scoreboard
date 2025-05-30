import { Achievement } from '../models/Achievement.js'
import { Challenge } from '../models/Challenge.js'
import { GameConfig } from '../models/GameConfig.js'
import {
  ChallengeScore,
  GameScore,
  RewardScore,
  TeamScore,
} from '../models/GameScore.js'
import { BaseReward, Reward } from '../models/Reward.js'

export function computeGameScore(
  achievements: Achievement[],
  rewards: Reward[],
  challenges: Challenge[],
  teams: string[],
  config: GameConfig,
): GameScore {
  const challsScore = computeChallenges(challenges, achievements, config)
  const rewardsScore = computeRewards(rewards, config)
  const teamsScore = computeTeams(teams, challsScore, rewardsScore)

  const scorersNotOnPodium = teamsScore.filter(s => s.score > 0 && s.rank > 3)
  const beforeLastScorer =
    scorersNotOnPodium.length > 2
      ? scorersNotOnPodium[scorersNotOnPodium.length - 2]
      : undefined

  return {
    challsScore,
    teamsScore,
    beforeLastScorer,
  }
}

//#region challenge score
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
    // we need to keep simple equality check because on server side, we haven't a string but a Mongoose ObjectId
    .filter(a => a.challengeId == challenge._id)
    .sort((x, y) => x.createdAt.getTime() - y.createdAt.getTime())

  return {
    challenge,
    score: computeChallengeScore(challenge, config, a.length),
    achievements: a,
  }
}

function computeChallengeScore(
  challenge: Challenge,
  config: GameConfig,
  solvedCount: number = 0,
): number {
  return config.baseChallScore * (config.teamCount - solvedCount)
}
//#endregion

//#region reward score
function computeRewards(rewards: Reward[], config: GameConfig): RewardScore[] {
  return rewards.map<RewardScore>(r => ({
    reward: r,
    score: computeRewardScore(r, config),
  }))
}

export function computeRewardScore(
  reward: BaseReward,
  config: GameConfig,
): number {
  return reward.value * config.teamCount
}
//#endregion

//#region team score
function computeTeams(
  teams: string[],
  challsScore: Record<string, ChallengeScore>,
  rewards: RewardScore[],
): TeamScore[] {
  return teams
    .map(t => computeTeam(challsScore, t, rewards))
    .sort((a, b) => b.score - a.score)
    .map((ts, i, tss) => ({
      ...ts,
      rank: tss.findIndex(x => x.score === ts.score) + 1,
    }))
}

function computeTeam(
  challsScore: Record<string, ChallengeScore>,
  team: string,
  rewards: RewardScore[],
): TeamScore {
  const challengeResolved = Object.values(challsScore).filter(cs =>
    cs.achievements.find(a => a.teamname === team),
  )
  const rewardAcquired = rewards.filter(r => r.reward.teamname === team)

  return {
    rank: 0,
    team,
    score: computeTeamScore(challengeResolved, rewardAcquired),
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
  rewards: RewardScore[],
): number {
  return (
    challsScore.reduce((agg, cs) => agg + cs.score, 0) +
    rewards.reduce((acc, cur) => acc + cur.score, 0)
  )
}
//#endregion
