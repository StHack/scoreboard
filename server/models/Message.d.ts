export type BaseMessage = {
  content: string
  challengeId?: string
}
export type Message = BaseMessage & {
  createdAt: Date
  _id: string
}
