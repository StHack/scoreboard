import { Achievement } from './Achievement.js'
import { Challenge } from './Challenge.js'
import { Reward } from './Reward.js'

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
  team: string
  score: number
  breakthroughs: Achievement[]
  solved: Achievement[]
  rewards: RewardScore[]
}

export type GameScore = {
  challsScore: Record<string, ChallengeScore>
  teamsScore: TeamScore[]
}

export type PlayerScore = {
  myScore: number
  myTeamScore: number
}
