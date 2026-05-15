import { Team } from './Team.js'

export type BaseReward = {
  teamId: string
  label: string
  value: number
}
export type Reward = BaseReward & {
  createdAt: Date
  team: Team
  _id: string
}
