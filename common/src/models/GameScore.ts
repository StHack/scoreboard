import { Achievement } from './Achievement.js'
import { Challenge, DummyChallenge } from './Challenge.js'
import { BaseGameConfig } from './GameConfig.js'
import { Reward } from './Reward.js'
import { DummyTeam, Team } from './Team.js'

export type ChallengeScore = {
  challenge: Challenge
  score: number
  achievements: Achievement[]
}

export type RewardScore = {
  reward: Reward
  score: number
}

export type TeamScore = {
  rank: number
  team: Team
  score: number
  breakthroughs: Achievement[]
  solved: Achievement[]
  rewards: RewardScore[]
}

export type GameScore = {
  challsScore: Record<string, ChallengeScore>
  teamsScore: TeamScore[]
  config: BaseGameConfig
  beforeLastScorer?: TeamScore
}

export type PlayerScore = {
  myScore: number
  myTeamScore: number
}

export const dummyTeamScore: TeamScore = {
  team: DummyTeam,
  breakthroughs: [],
  rank: -1,
  rewards: [],
  score: -1,
  solved: [],
}

export const dummyChallengeScore: ChallengeScore = {
  achievements: [],
  challenge: DummyChallenge,
  score: -1,
}
