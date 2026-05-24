import { BaseToken, Token, TokenType } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Token>({
  challengeId: { type: String, required: true },
  teamId: { type: String, required: true },
  type: { type: String, enum: TokenType, required: true },
  value: { type: String, required: true },
})

schema.index({ challengeId: 1, teamId: 1 }, { unique: true })

const TokenModel = model<Token>('Token', schema)

const removeMongoProperties = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: [],
})

export async function createTokens(...tokens: BaseToken[]): Promise<Token[]> {
  const docs = await TokenModel.insertMany(tokens)
  return docs.map(doc => doc.toObject(removeMongoProperties))
}

export async function listTokensByChallenge(
  challengeId: string,
): Promise<Token[]> {
  const tokens = await TokenModel.find({ challengeId })
  return tokens.map(token => token.toObject(removeMongoProperties))
}

export async function listTokensByTeam(teamId: string): Promise<Token[]> {
  const tokens = await TokenModel.find({ teamId })
  return tokens.map(token => token.toObject(removeMongoProperties))
}

export async function removeTokensByChallenge(
  challengeId: string,
): Promise<void> {
  await TokenModel.deleteMany({ challengeId })
}

export async function removeTokensByTeam(teamId: string): Promise<void> {
  await TokenModel.deleteMany({ teamId })
}
