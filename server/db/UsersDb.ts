import { createHash } from 'crypto'
import { CreateUser, AuthUser, User } from 'models/User'
import { Schema, model, Error } from 'mongoose'
import { salt } from 'sthack-config'
import { removeMongoProperties } from './main'

const schema = new Schema<AuthUser>({
  username: { type: String, required: true, minlength: 5, unique: true },
  password: { type: String, required: true, minlength: 5 },
  team: { type: String, required: true, minlength: 5 },
  isAdmin: { type: Boolean, required: true },
})

const UserModel = model<AuthUser>('User', schema)

const passwordHasher = (password: string | undefined) =>
  password
    ? createHash('sha256')
        .update(password + salt())
        .digest('hex')
    : undefined

export async function registerUser({
  username,
  password,
  team,
}: CreateUser): Promise<void> {
  const hashed = passwordHasher(password)

  const memberCount = await UserModel.count({ team })
  if (memberCount >= 8) throw new Error('Team is already full')

  try {
    const doc = new UserModel({
      username,
      password: hashed,
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

      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        throw new Error('Username already used')
      }
    }

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

  const hash = passwordHasher(password)

  if (user.password !== hash) {
    return undefined
  }

  const { password: p, ...rest } = user.toObject(removeMongoProperties)
  return rest
}

export async function getUser(username: string): Promise<User | undefined> {
  const user = await UserModel.findOne({ username })
  if (!user) return undefined

  const { password, ...rest } = user.toObject(removeMongoProperties)
  return rest
}

export async function removeUser(username: string): Promise<void> {
  await UserModel.findOneAndDelete({ username })
}

export async function listUser(): Promise<User[]> {
  const users = await UserModel.find()

  return users
    .map(u => u.toObject(removeMongoProperties))
    .map(({ password, ...rest }) => rest)
}

export async function listTeam(): Promise<string[]> {
  return await UserModel.distinct('team', {
    team: { $ne: 'admin' },
  })
}

export async function updateUser(
  username: string,
  { team, password, isAdmin }: Partial<AuthUser>,
): Promise<User> {
  const document = await UserModel.findOneAndUpdate(
    { username },
    { team, isAdmin, password: passwordHasher(password) },
    { new: true },
  )

  const { password: p, ...rest } = document.toObject(removeMongoProperties)
  return rest
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
