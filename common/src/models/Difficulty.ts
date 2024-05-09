export const Difficulties = ['special', 'easy', 'medium', 'hard'] as const

export type Difficulty = (typeof Difficulties)[number]

export const DifficultyValue: Record<Difficulty, number> = {
  special: 0,
  easy: 1,
  medium: 2,
  hard: 3,
}
