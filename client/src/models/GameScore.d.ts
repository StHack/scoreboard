import { Achievement } from './Achievement'

export type ChallengeScore = {
  score: number
  achievements: Achievement[]
}

export type TeamScore = {
  rank: number
  team: string
  score: number
  breakthroughs: Achievement[]
  solved: Achievement[]
}

export type UserScore = {
  rank: number
  team: string
  score: number
  breakthroughs: Achievement[]
}

export type GameScore = {
  challsScore: Record<string, ChallengeScore>
  teamsScore: TeamScore[]
}

export type PlayerScore = {
  myScore: number
  myTeamScore: number
}
