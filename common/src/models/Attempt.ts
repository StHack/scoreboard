import { Challenge } from './Challenge.js'
import { Team } from './Team.js'

export type BaseAttempt = {
  challengeId: string
  username: string
  teamId: string
  proposal: string
}
export type Attempt = BaseAttempt & {
  createdAt: Date
  _id: string
  challenge: Challenge
  team: Team
}
