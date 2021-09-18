export type User = {
  username: string
  password: string
  team: string
  isAdmin: boolean
}

export type CreateUser = {
  username: string
  password: string
  team: string
}
