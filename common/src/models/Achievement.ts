import { Challenge } from './Challenge.js'
import { Survey } from './Survey.js'

export type BaseAchievement = {
  challengeId: string
  username: string
  teamname: string
}
export type Achievement = BaseAchievement & {
  createdAt: Date
  _id: string
  challenge: Challenge
  survey?: Survey
}
