import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { GameConfig } from 'models/GameConfig'
import { ChallengeScore, GameScore, TeamsScore } from 'models/GameScore'
import { User } from 'models/User'

export function computeGameScore (
  achievements: Achievement[],
  challenges: Challenge[],
  teams: string[],
  config: GameConfig,
  user: User,
): GameScore {
  const challsScore = challenges.reduce<Record<string, ChallengeScore>>(
    (agg, challenge) => ({
      ...agg,
      [challenge.name]: computeChallengeScore(
        achievements,
        challenge,
        config,
        user.team,
      ),
    }),
    {},
  )

  const teamsScore = teams
    .map(t => computeTeamScore(challsScore, t))
    .sort((a, b) => b.score - a.score)
    .map((ts, i, tss) => ({
      ...ts,
      rank: tss.findIndex(x => x.score === ts.score) + 1,
    }))

  return {
    myTeamScore: computeMyTeamScore(challsScore),
    myScore: computeMyScore(challsScore, user.username),
    challsScore,
    teamsScore,
  }
}

function computeChallengeScore (
  achievements: Achievement[],
  challenge: Challenge,
  config: GameConfig,
  team: string,
): ChallengeScore {
  const a = achievements
    .filter(a => a.challenge === challenge.name)
    .sort((x, y) => x.createdAt.getTime() - y.createdAt.getTime())

  return {
    score: computeScore(challenge, config, a.length),
    achievements: a,
    myTeamSolved: a.find(aa => aa.teamname === team),
  }
}

function computeTeamScore (
  challsScore: Record<string, ChallengeScore>,
  team: string,
): TeamsScore {
  return {
    rank: 0,
    team,
    score: Object.values(challsScore)
      .filter(cs => cs.achievements.find(a => a.teamname === team))
      .reduce((agg, cs) => agg + cs.score, 0),
    breakthroughs: Object.values(challsScore)
      .map(cs => cs.achievements[0])
      .filter(a => a?.teamname === team),
  }
}

function computeMyTeamScore (
  challSolvation: Record<string, ChallengeScore>,
): number {
  return Object.values(challSolvation)
    .filter(c => !!c.myTeamSolved)
    .reduce((p, c) => p + c.score, 0)
}

function computeMyScore (
  challSolvation: Record<string, ChallengeScore>,
  user: string,
): number {
  return Object.values(challSolvation)
    .filter(c => c.myTeamSolved?.username === user)
    .reduce((p, c) => p + c.score, 0)
}

export function computeScore (
  challenge: Challenge,
  config: GameConfig,
  solvedCount: number = 0,
): number {
  return (
    config.baseChallScore *
    DifficultyValue[challenge.difficulty] *
    (config.teamCount - solvedCount)
  )
}

const DifficultyValue: Record<Difficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
}
