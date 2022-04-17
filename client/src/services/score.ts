import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { GameConfig } from 'models/GameConfig'
import { ChallengeScore, GameScore, TeamScore } from 'models/GameScore'

export function computeGameScore (
  achievements: Achievement[],
  challenges: Challenge[],
  teams: string[],
  config: GameConfig,
): GameScore {
  const challsScore = computeChallsScore(challenges, achievements, config)
  const teamsScore = computeTeamsScore(teams, challsScore)

  return {
    challsScore,
    teamsScore,
  }
}
function computeChallsScore (
  challenges: Challenge[],
  achievements: Achievement[],
  config: GameConfig,
): Record<string, ChallengeScore> {
  return challenges.reduce<Record<string, ChallengeScore>>(
    (agg, challenge) => ({
      ...agg,
      [challenge.name]: computeChallengeScore(achievements, challenge, config),
    }),
    {},
  )
}

function computeChallengeScore (
  achievements: Achievement[],
  challenge: Challenge,
  config: GameConfig,
): ChallengeScore {
  const a = achievements
    .filter(a => a.challenge === challenge.name)
    .sort((x, y) => x.createdAt.getTime() - y.createdAt.getTime())

  return {
    score: computeScore(challenge, config, a.length),
    achievements: a,
  }
}

function computeTeamsScore (
  teams: string[],
  challsScore: Record<string, ChallengeScore>,
): TeamScore[] {
  return teams
    .map(t => computeTeamScore(challsScore, t))
    .sort((a, b) => b.score - a.score)
    .map((ts, i, tss) => ({
      ...ts,
      rank: tss.findIndex(x => x.score === ts.score) + 1,
    }))
}

function computeTeamScore (
  challsScore: Record<string, ChallengeScore>,
  team: string,
): TeamScore {
  return {
    rank: 0,
    team,
    score: Object.values(challsScore)
      .filter(cs => cs.achievements.find(a => a.teamname === team))
      .reduce((agg, cs) => agg + cs.score, 0),
    breakthroughs: Object.values(challsScore)
      .map(cs => cs.achievements[0])
      .filter(a => a?.teamname === team),
    solved: Object.values(challsScore)
      .flatMap(cs => cs.achievements)
      .filter(a => a?.teamname === team),
  }
}

function computeScore (
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
