import { Category } from './Category.js'
import { Difficulty } from './Difficulty.js'

export type BaseChallenge = {
  name: string
  description: string
  img: string
  author: string
  flag?: string
  category: Category
  difficulty: Difficulty
}

export type Challenge = BaseChallenge & {
  isBroken: boolean
  _id: string
}
