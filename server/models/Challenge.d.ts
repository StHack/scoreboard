import { Difficulty } from './Difficulty'

export type BaseChallenge = {
  name: string
  description: string
  img: string
  author: string
  flag?: string
  category: string
  difficulty: Difficulty
}

export type Challenge = BaseChallenge & {
  isBroken: boolean
  isOpen: boolean
}
