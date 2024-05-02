import { Attempt, BaseAttempt } from 'models/Attempt.js'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Attempt>(
  {
    challengeId: { type: String, required: true },
    username: { type: String, required: true },
    teamname: { type: String, required: true },
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

export async function listAttempt(): Promise<Attempt[]> {
  const results = await AttemptModel.find().sort({ updatedAt: -1 }).limit(200)

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

export async function getTeamAttempt(teamname: string): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ teamname })
  return docs.map(d =>
    d.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}

export async function getChallengeAttempt(
  challengeId: string,
): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ challengeId })
  return docs.map(d =>
    d.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}

export async function getUserAttempt(username: string): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ username })
  return docs.map(d =>
    d.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}
