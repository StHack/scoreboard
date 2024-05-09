import { BaseMessage, Message } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Message>(
  {
    content: { type: String, required: true },
    challengeId: { type: Schema.ObjectId, ref: 'Challenge' },
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

  return results.map(r =>
    r.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}
