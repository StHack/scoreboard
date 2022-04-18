export type BaseMessage = {
  content: string
  challenge?: string
}
export type Message = BaseMessage & {
  createdAt: Date
}
