import { Achievement } from './Achievement.js'
import { Challenge } from './Challenge.js'
import { Team } from './Team.js'

export type BaseSurvey = {
  satisfaction: number
  perceivedDifficulty: number
  aiUsage: number
  feedback?: string
}

export type Survey = BaseSurvey & {
  achievementId: string

  challengeId: string
  username: string
  teamId: string
  team: Team

  challenge: Challenge
  achievement: Achievement
  _id: string
  createdAt: Date
}

export type RatingLabels = Record<number, string>

export const ratingSatisfaction: RatingLabels = {
  1: 'Boring',
  2: 'Not very fun',
  3: 'Okay',
  4: 'Fun',
  5: 'Awesome',
}

export const ratingPerceivedDifficulty: RatingLabels = {
  1: 'too easy',
  2: 'easy',
  3: 'medium',
  4: 'hard',
  5: 'too hard',
}

export const ratingAIUsage: RatingLabels = {
  1: 'I, myself, am the ultimate LLM ! (no AI at all)',
  2: "I'm outta credits bro... (you use the AI to get some hints or explanation)",
  3: 'Me and my AI therapist has collaborated closely (Copilot wrote as much code as you)',
  4: "Let's vibe baby !! (you use the AI intensively to solve it)",
  5: 'Claude is here to put an end to that CTF ! (the AI solved it entirely for you)',
}
