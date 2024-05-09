import { CreateUser, User } from '@sthack/scoreboard-common'
import { createHash, randomUUID } from 'crypto'
import { model, Schema, ToObjectOptions } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

type DbUser = {
  username: string
  password: string
  salt: string
  team: string
  isAdmin: boolean
}

const schema = new Schema<DbUser>({
  username: { type: String, required: true, minlength: 5, unique: true },
  password: { type: String, required: true, minlength: 5 },
  salt: { type: String, required: true },
  team: { type: String, required: true, minlength: 5 },
  isAdmin: { type: Boolean, required: true },
})

const UserModel = model<DbUser>('User', schema)

const passwordHasher = (password: string | undefined, salt: string) =>
  password
    ? createHash('sha256')
        .update(password + salt)
        .digest('hex')
    : undefined

const removeProperties: ToObjectOptions = removeMongoPropertiesWithOptions({
  removeId: true,
  propsToRemove: ['password', 'salt'],
})

export async function registerUser(
  { username, password, team }: CreateUser,
  maxTeamSize: number,
): Promise<void> {
  const salt = randomUUID()
  const hashed = passwordHasher(password, salt)

  const memberCount = await UserModel.countDocuments({ team })
  validateUser({ username, team })

  if (memberCount >= maxTeamSize) throw new Error('Team is already full')

  try {
    const doc = new UserModel({
      username,
      password: hashed,
      salt,
      team,
      isAdmin: false,
    })

    await doc.save()
  } catch (error) {
    // TODO log error
    if (error instanceof global.Error) {
      if (error.name === 'ValidationError') {
        throw error
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        throw new Error('Username already used')
      }
    }

    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw 'an unexpected error occured'
  }
}

export async function login(
  username: string,
  password: string,
): Promise<User | undefined> {
  const user = await UserModel.findOne({ username })

  if (!user) {
    return undefined
  }

  const hash = passwordHasher(password, user.salt)

  if (user.password !== hash) {
    return undefined
  }

  return user.toObject(removeProperties)
}

export async function getUser(username: string): Promise<User | undefined> {
  const user = await UserModel.findOne({ username })
  if (!user) return undefined

  return user.toObject(removeProperties)
}

export async function removeUser(username: string): Promise<void> {
  await UserModel.findOneAndDelete({ username })
}

export async function listUser(): Promise<User[]> {
  const users = await UserModel.find().sort({ _id: -1 })

  return users.map(u => u.toObject(removeProperties))
}

export async function listTeam(): Promise<string[]> {
  return await UserModel.distinct('team', {
    team: { $ne: 'admin' },
  })
}

export async function updateUser(
  username: string,
  { team, password, isAdmin }: Partial<DbUser>,
): Promise<User> {
  validateUser({ username, team: team ?? '' })
  if (password) {
    const user = await UserModel.findOne({ username })

    if (!user) {
      throw new Error(
        `User ${username} hasn't been updated because it was not found`,
      )
    }

    password = passwordHasher(password, user.salt)
  }

  const document = await UserModel.findOneAndUpdate(
    { username },
    { team, isAdmin, password },
    { new: true },
  )

  if (!document) {
    throw new Error(
      `User ${username} hasn't been updated because it was not found`,
    )
  }

  return document.toObject(removeProperties)
}

export async function countTeam(): Promise<number> {
  const result = await UserModel.aggregate()
    .match({ team: { $ne: 'admin' } })
    .group({
      _id: '$team',
      count: { $sum: 1 },
    })

  return result.length
}

export function validateUser({ username, team }: Partial<DbUser>) {
  if (username === '__proto__') {
    throw new Error('Invalid username')
  }

  if (team === '__proto__') {
    throw new Error('Invalid team')
  }
}
