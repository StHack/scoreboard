export type BaseMessage = {
  content: string
}
export type Message = BaseMessage & {
  createdAt: Date
}
