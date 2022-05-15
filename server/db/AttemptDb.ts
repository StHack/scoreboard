import { Attempt, BaseAttempt } from 'models/Attempt'
import { Schema, model } from 'mongoose'
import { removeMongoProperties } from './main'

const schema = new Schema<Attempt>(
  {
    challenge: { type: String, required: true },
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
  return doc.toObject(removeMongoProperties)
}

export async function listAttempt(): Promise<Attempt[]> {
  const results = await AttemptModel.find()

  return results.map(r => r.toObject(removeMongoProperties))
}

export async function getTeamAttempt(teamname: string): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ teamname })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function getChallengeAttempt(
  challenge: string,
): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ challenge })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function getUserAttempt(username: string): Promise<Attempt[]> {
  const docs = await AttemptModel.find({ username })
  return docs.map(d => d.toObject(removeMongoProperties))
}
