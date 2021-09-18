import { createHash } from 'crypto'
import { CreateUser, AuthUser, User } from 'models/User'
import { Schema, model, Error } from 'mongoose'
import { removeMongoProperties } from './main'

const schema = new Schema<AuthUser>({
  username: { type: String, required: true, minlength: 5, unique: true },
  password: { type: String, required: true, minlength: 5 },
  team: { type: String, required: true, minlength: 5 },
  isAdmin: { type: Boolean, required: true },
})

const UserModel = model<AuthUser>('User', schema)

const passwordHasher = (password: string) =>
  password ? createHash('sha256').update(password).digest('hex') : undefined

export async function registerUser({
  username,
  password,
  team,
}: CreateUser): Promise<void> {
  const hashed = passwordHasher(password)

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
  await UserModel.findOneAndDelete({ name: username })
}
