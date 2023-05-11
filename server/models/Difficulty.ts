export const Difficulties = ['special', 'easy', 'medium', 'hard'] as const

export type Difficulty = typeof Difficulties[number]
