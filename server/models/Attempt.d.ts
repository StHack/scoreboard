export type BaseAttempt = {
  challengeId: string
  username: string
  teamname: string
  proposal: string
}
export type Attempt = BaseAttempt & {
  createdAt: Date
  _id: string
}
