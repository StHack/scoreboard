import { Achievement } from './Achievement'

export type ChallengeScore = {
  score: number
  myTeamSolved?: Achievement
  achievements: Achievement[]
}

export type TeamsScore = {
  rank: number
  team: string
  score: number
  breakthroughs: Achievement[]
}

export type GameScore = {
  myTeamScore: number
  myScore: number
  challsScore: Record<string, ChallengeScore>
  teamsScore: TeamsScore[]
}
