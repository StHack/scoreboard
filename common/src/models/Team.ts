import { Player } from './User.js'

export type CreateTeam = {
  name: string
}

export type Team = CreateTeam & {
  _id: string
}

export type FullTeam = Team & {
  joinToken: string
  players: Player[]
}

export const DummyTeam: Team = {
  _id: '',
  name: '',
}
