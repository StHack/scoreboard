import { Category } from './Category'
import { Difficulty } from './Difficulty'

export type BaseChallenge = {
  name: string
  description: string
  link?: string
  img: string
  author: string
  flags: string[]
  category: Category
  difficulty: Difficulty
}

export type Challenge = BaseChallenge & {
  isBroken: boolean
  isOpen: boolean
}
