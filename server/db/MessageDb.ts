import { BaseMessage, Message } from 'models/Message'
import { Schema, model } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main'

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

  return doc.toObject(removeMongoPropertiesWithOptions({ removeId: false }))
}

export async function listMessage(): Promise<Message[]> {
  const results = await MessageModel.find().sort({ updatedAt: -1 })

  return results.map(r => r.toObject(removeMongoPropertiesWithOptions({ removeId: false })))
}
