export const Difficulties = ['easy', 'medium', 'hard'] as const

export type Difficulty = typeof Difficulties[number]
