import { getChallenge, listChallenge } from 'db/ChallengeDb.js'
import { listTeam } from 'db/TeamDb.js'
import {
  createTokens,
  listTokensByChallenge,
  listTokensByTeam,
  removeTokensByChallenge,
} from 'db/TokenDb.js'
import { IRouter, Request, Response } from 'express'
import {
  AdminTokenResponse,
  BaseToken,
  Challenge,
  Team,
  Token,
  TokenType,
} from 'node_modules/@sthack/scoreboard-common/src/index.js'
import { nanoid } from 'node_modules/nanoid/index.js'

export async function createTokensForChallenge({
  _id: challengeId,
  token,
}: Challenge): Promise<Token[]> {
  if (!token) {
    await removeTokensByChallenge(challengeId)
    return []
  }

  const teams = await listTeam()
  const existingTokens = await listTokensByChallenge(challengeId)
  const tokens = teams
    .filter(team => !existingTokens.some(token => token.teamId === team._id))
    .map<BaseToken>(team => ({
      challengeId: challengeId,
      teamId: team._id,
      type: token.type,
      value: generateTokenValue(token.type, team._id),
    }))

  const created = await createTokens(...tokens)
  return [...existingTokens, ...created]
}

export async function createTokenForTeam({
  _id: teamId,
}: Team): Promise<Token[]> {
  const tokens = await listTokensByTeam(teamId)
  const challenges = await listChallenge()
  const tokensToCreate = challenges
    .filter(chall => chall.token)
    .filter(chall => !tokens.some(token => token.challengeId === chall._id))
    .map<BaseToken>(chall => ({
      challengeId: chall._id,
      teamId,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      type: chall.token!.type,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      value: generateTokenValue(chall.token!.type, teamId),
    }))

  const created = await createTokens(...tokensToCreate)
  return [...tokens, ...created]
}

function generateTokenValue(type: TokenType, teamId: string): string {
  switch (type) {
    case TokenType.teamId:
      return teamId
    case TokenType.uuidV4:
      return crypto.randomUUID()
    case TokenType.nanoIdDefault:
      return nanoid()
    case TokenType.nanoIdShort:
      return nanoid(8)
    case TokenType.nanoIdMedium:
      return nanoid(16)
    default:
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Unsupported token type: ${type}`)
  }
}

export function registerTokens(app: IRouter) {
  app.get(
    '/api/admin/challenges/:challengeId/team-tokens',
    async (req: Request, res: Response) => {
      const challengeId = req.params.challengeId
      if (typeof challengeId !== 'string') {
        res.status(400).send('Invalid challenge id')
        return
      }

      const challenge = await getChallenge(challengeId)
      if (!challenge) {
        res.status(404).send('Challenge not found')
        return
      }

      if (!challenge.token?.adminApiKey) {
        res.status(400).send('This challenge has no team token configured')
        return
      }

      const providedKey = req.header('x-api-key')?.trim()
      if (!providedKey) {
        res.status(401).send('Unauthorized: missing api key')
        return
      }

      if (providedKey !== challenge.token.adminApiKey) {
        res.status(403).send('Forbidden: invalid api key')
        return
      }

      const tokens = await listTokensByChallenge(challengeId)
      const teams = await listTeam()
      const teamMap = new Map(teams.map(t => [t._id, t.name]))
      res.json({
        challengeId,
        challengeName: challenge.name,
        tokenType: challenge.token.type,
        tokens: tokens.map(({ teamId, value }) => ({
          teamId,
          teamName: teamMap.get(teamId) || 'Unknown Team',
          value,
        })),
      } satisfies AdminTokenResponse)
    },
  )
}
