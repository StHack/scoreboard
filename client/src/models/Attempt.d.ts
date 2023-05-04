export type BaseAttempt = {
  challenge: string
  username: string
  teamname: string
  proposal: string
}
export type Attempt = BaseAttempt & {
  createdAt: Date
  _id: string
}
