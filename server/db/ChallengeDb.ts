import { createHash } from 'crypto'
import { BaseChallenge, Challenge } from 'models/Challenge'
import { Difficulties } from 'models/Difficulty'
import { Schema, model } from 'mongoose'
import { removeMongoProperties } from './main'

const schema = new Schema<Challenge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String },
  author: { type: String, required: true },
  flags: { type: [String], required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: Difficulties, required: true },

  isBroken: { type: Boolean, required: true },
  isOpen: { type: Boolean, required: true },
})

const ChallengeModel = model<Challenge>('Challenge', schema)

const flagHasher = (password: string) =>
  createHash('sha256').update(password).digest('hex')

export async function createChallenge(
  chall: BaseChallenge,
): Promise<Challenge> {
  const flags = (chall.flags ?? []).map(flagHasher)

  const doc = new ChallengeModel({
    ...chall,
    flags,
    isOpen: true,
    isBroken: false,
  })

  const document = await doc.save()
  return document.toObject(removeMongoProperties)
}

export async function listChallenge(): Promise<Challenge[]> {
  const results = await ChallengeModel.find()

  return results.map(r => r.toObject(removeMongoProperties))
}

export async function checkChallenge(
  challName: string,
  flag: string,
): Promise<boolean> {
  const chall = await ChallengeModel.findOne({ name: challName })

  if (!chall) {
    throw new Error('invalid challenge')
  }

  if (chall.isBroken) {
    throw new Error('Chall is broken')
  }

  if (!chall.isOpen) {
    throw new Error('Chall is not open')
  }

  const hash = flagHasher(flag)
  return chall.flags.includes(hash)
}

export async function removeChallenge(challName: string): Promise<void> {
  await ChallengeModel.deleteOne({ name: challName })
}

export async function updateChallenge(
  challName: string,
  { name, flags, ...challenge }: Partial<Challenge>,
): Promise<Challenge> {
  let newFlags: string[] | undefined = undefined
  if (flags?.length) {
    const document = await ChallengeModel.findOne({ name: challName })
    newFlags = document!.flags.concat(flags.map(flagHasher))
  }

  const document = await ChallengeModel.findOneAndUpdate(
    { name: challName },
    { ...challenge, flags: newFlags },
    { new: true },
  )
  return document.toObject(removeMongoProperties)
}

export async function closeAllChallenge(): Promise<void> {
  await ChallengeModel.updateMany({}, { isOpen: false })
}
