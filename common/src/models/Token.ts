import { Challenge } from './Challenge.js'
import { Team } from './Team.js'

export enum TokenType {
  teamId = 'teamId',
  uuidV4 = 'uuid-v4',
  nanoIdDefault = 'nanoId-21',
  nanoIdShort = 'nanoId-8',
  nanoIdMedium = 'nanoId-16',
}

export const TokenTypeLabels: Record<TokenType, string> = {
  [TokenType.teamId]:
    'Team ID - No value is generated but you can retrieve the team list',
  [TokenType.uuidV4]: 'UUID v4',
  [TokenType.nanoIdDefault]: 'NanoID Default format (21 chars)',
  [TokenType.nanoIdShort]: 'NanoID Short format(8 chars)',
  [TokenType.nanoIdMedium]: 'NanoID Medium format (16 chars)',
}

export type BaseToken = {
  challengeId: string
  teamId: string
  type: TokenType
  value: string
}

export type Token = BaseToken & {
  _id: string
  challenge: Challenge
  team: Team
}

export type AdminToken = {
  teamId: string
  teamName: string
  value: string
}

export type AdminTokenResponse = {
  challengeId: string
  challengeName: string
  tokenType: TokenType
  tokens: AdminToken[]
}
