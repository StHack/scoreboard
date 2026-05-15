import { Attempt, BaseAttempt } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Attempt>(
  {
    challengeId: { type: String, required: true },
    username: { type: String, required: true },
    teamId: { type: String, required: true },
    proposal: { type: String, required: true },
  },
  { timestamps: true },
)

const AttemptModel = model<Attempt>('Attempt', schema)

export async function registerAttempt(attempt: BaseAttempt): Promise<Attempt> {
  const doc = new AttemptModel(attempt)
  await doc.save()
  return doc.toObject(removeMongoPropertiesWithOptions({ removeId: false }))
}

export async function listAttempt({ nolimit = false }): Promise<Attempt[]> {
  const results = nolimit
    ? await AttemptModel.find().sort({ updatedAt: -1 })
    : await AttemptModel.find().sort({ updatedAt: -1 }).limit(200)

  return results.map(r =>
    r.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}

export async function listAttemptAfter(date: Date): Promise<Attempt[]> {
  const results = await AttemptModel.find({
    createdAt: { $gte: date },
  })
    .sort({ updatedAt: 1 })
    .limit(200)

  return results.map(r =>
    r.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}

export async function getSimilarAttempts({
  challengeId,
  teamId,
}: BaseAttempt): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ challengeId, teamId }).sort({
    createdAt: -1,
  })
  return docs.map(d =>
    d.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}
