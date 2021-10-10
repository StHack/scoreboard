export type ChallengeScore = {
  score: number
  lastSolved?: Date
  solvedBy?: string
}

export type GameScore = {
  teamScore: number
  myScore: number
  challScore: Record<string, ChallengeScore>
}
