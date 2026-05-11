import { Challenge, DummyChallenge } from './Challenge.js'

export type BaseAchievement = {
  challengeId: string
  username: string
  teamname: string
}
export type Achievement = BaseAchievement & {
  createdAt: Date
  _id: string
  challenge: Challenge
}

export const DummyAchievement: Achievement = {
  _id: '',
  challengeId: '',
  teamname: '',
  username: '',
  challenge: DummyChallenge,
  createdAt: new Date(),
}
