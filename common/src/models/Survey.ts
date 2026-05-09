export type Survey = {
  satisfaction: number
  perceivedDifficulty: number
  aiUsage: number
  feedback?: string
}

export type CreateSurvey = {
  challengeId: string
  survey: Survey
}
