import {
  BaseChallenge,
  Challenge,
  Difficulties,
} from '@sthack/scoreboard-common'
import { createHash, randomUUID } from 'crypto'
import { model, Schema, ToObjectOptions } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

type DbChallenge = Challenge & {
  salt: string
}

const schema = new Schema<DbChallenge>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  img: { type: String },
  author: { type: String, required: true },
  flag: { type: String, required: true },
  salt: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: Difficulties, required: true },

  isBroken: { type: Boolean, required: true },
})

const ChallengeModel = model<DbChallenge>('Challenge', schema)

const flagHasher = (password: string | undefined, salt: string) =>
  password &&
  createHash('sha256')
    .update(password + salt)
    .digest('hex')

const removeProperties: ToObjectOptions = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: ['flag', 'salt'],
})

export async function createChallenge(
  chall: BaseChallenge,
): Promise<Challenge> {
  const salt = randomUUID()
  const flag = flagHasher(chall.flag, salt)

  const doc = new ChallengeModel({
    ...chall,
    flag,
    salt,
    isBroken: false,
  })

  const document = await doc.save()
  return document.toObject(removeProperties)
}

export async function listChallenge(): Promise<Challenge[]> {
  const results = await ChallengeModel.find()

  return results.map(r => r.toObject(removeProperties))
}

export async function getChallenge(
  challengeId: string,
): Promise<Challenge | undefined> {
  const challenge = await ChallengeModel.findById(challengeId)
  return challenge?.toObject(removeProperties)
}

export async function checkChallenge(
  challengeId: string,
  flag: string,
): Promise<boolean> {
  const chall = await ChallengeModel.findById(challengeId)

  if (!chall) {
    throw new Error('invalid challenge')
  }

  if (chall.isBroken) {
    throw new Error('Chall is broken')
  }

  return flagHasher(flag, chall.salt) === chall.flag
}

export async function removeChallenge(challengeId: string): Promise<void> {
  await ChallengeModel.findByIdAndDelete(challengeId)
}

export async function updateChallenge(
  challengeId: string,
  { flag, ...challenge }: Partial<Challenge>,
): Promise<Challenge> {
  if (flag) {
    const chall = await ChallengeModel.findById(challengeId)

    if (!chall) {
      throw new Error(
        `Challenge ${challengeId} can't be updated because it was not found`,
      )
    }

    ;(challenge as Challenge).flag = flagHasher(flag, chall.salt)
  }

  const document = await ChallengeModel.findByIdAndUpdate(
    challengeId,
    { ...challenge },
    { new: true },
  )

  if (!document)
    throw new Error(
      `Challenge ${challengeId} hasn't been updated because it was not found`,
    )

  return document.toObject(removeProperties)
}
