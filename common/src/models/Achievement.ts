import { Challenge, DummyChallenge } from './Challenge.js'
import { DummyTeam, Team } from './Team.js'

export type BaseAchievement = {
  challengeId: string
  username: string
  teamId: string
}
export type Achievement = BaseAchievement & {
  createdAt: Date
  _id: string
  challenge: Challenge
  team: Team
}

export const DummyAchievement: Achievement = {
  _id: '',
  challengeId: '',
  teamId: '',
  username: '',
  challenge: DummyChallenge,
  team: DummyTeam,
  createdAt: new Date(),
}
