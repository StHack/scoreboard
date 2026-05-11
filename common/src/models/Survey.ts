import { Achievement } from './Achievement.js'
import { Challenge } from './Challenge.js'

export type BaseSurvey = {
  satisfaction: number
  perceivedDifficulty: number
  aiUsage: number
  feedback?: string
}

export type Survey = BaseSurvey & {
  achievementId: string

  challengeId: string
  username: string
  teamname: string

  challenge: Challenge
  achievement: Achievement
  _id: string
  createdAt: Date
}
