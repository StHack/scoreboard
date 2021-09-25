export type BaseAchievement = {
  challenge: string
  username: string
  teamname: string
}
export type Achievement = BaseAchievement & {
  createdAt: Date
}
