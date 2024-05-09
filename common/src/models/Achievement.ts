export type BaseAchievement = {
  challengeId: string
  username: string
  teamname: string
}
export type Achievement = BaseAchievement & {
  createdAt: Date
  challenge: string
}
