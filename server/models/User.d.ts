export type AuthUser = {
  username: string
  password: string
  salt: string
  team: string
  isAdmin: boolean
}

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

export type UserLike = {
  username: string
  team: string
}
