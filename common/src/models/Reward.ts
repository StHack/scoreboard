export type BaseReward = {
  teamname: string
  label: string
  value: number
}
export type Reward = BaseReward & {
  createdAt: Date
  _id: string
}
