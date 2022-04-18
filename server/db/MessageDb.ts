import { BaseMessage, Message } from 'models/Message'
import { Schema, model } from 'mongoose'
import { removeMongoProperties } from './main'

const schema = new Schema<Message>(
  {
    content: { type: String, required: true },
    challenge: { type: String }
  },
  { timestamps: true },
)

const MessageModel = model<Message>('Message', schema)

export async function addMessage(message: BaseMessage): Promise<Message> {
  const doc = new MessageModel(message)
  await doc.save()

  return doc.toObject(removeMongoProperties)
}

export async function listMessage(): Promise<Message[]> {
  const results = await MessageModel.find()

  return results.map(r => r.toObject(removeMongoProperties))
}
