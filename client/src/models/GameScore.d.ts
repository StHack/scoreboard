export type ChallengeScore = {
  score: number
  lastSolved?: Date
  isSolved: boolean
}

export type GameScore = {
  teamScore: number
  myScore: number
  challScore: Record<string, ChallengeScore>
}
