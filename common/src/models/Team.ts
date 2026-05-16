import { User } from './User.js'

export type CreateTeam = {
  name: string
}

export type JoinTeam = {
  joinToken: string
}

export type Team = CreateTeam & {
  _id: string
}

export type FullTeam = Team &
  JoinTeam & {
    players: User[]
  }

export const DummyTeam: Team = {
  _id: '',
  name: '',
}

export const DummyFullTeam: FullTeam = {
  ...DummyTeam,
  joinToken: '',
  players: [],
}
