export type CreateUser = {
  username: string
  password: string
  team: string
}

export type User = {
  username: string
  team: string
  isAdmin: boolean
}

export type LoginCredentials = {
  username: string
  password: string
}
