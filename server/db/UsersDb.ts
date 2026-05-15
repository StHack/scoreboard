import { CreateUser, Player, User, UserRole } from '@sthack/scoreboard-common'
import { createHash, randomUUID } from 'crypto'
import debug from 'debug'
import { model, Schema, ToObjectOptions } from 'mongoose'
import { removeMongoPropertiesWithOptions, ValidationError } from './main.js'

const logger = debug('Db:User')

type DbUser = {
  username: string
  password: string
  salt: string
  teamId?: string
  roles: UserRole[]
}

const schema = new Schema<DbUser>({
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 42,
    unique: true,
  },
  password: { type: String, required: true, minlength: 5 },
  salt: { type: String, required: true },
  teamId: { type: String, required: false },
  roles: {
    type: [String],
    required: true,
    enum: Object.values(UserRole),
    default: [UserRole.User],
  },
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

export async function registerUser({
  username,
  password,
}: CreateUser): Promise<void> {
  const salt = randomUUID()
  const hashed = passwordHasher(password, salt)

  try {
    const doc = new UserModel({
      username,
      password: hashed,
      salt,
      roles: [UserRole.User],
    })

    await doc.save()
  } catch (error) {
    if (error instanceof global.Error) {
      if (error.name === 'ValidationError') {
        throw new ValidationError('Some fields are wrong', { cause: error })
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        throw new ValidationError('Username already used')
      }
    }

    logger('Unexpected error %o', error)

    throw error
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

export async function getTeamPlayers(teamId: string): Promise<User[]> {
  const users = await UserModel.find({ teamId })
  return users.map(p => p.toObject(removeProperties))
}

export async function removeUser(username: string): Promise<void> {
  await UserModel.findOneAndDelete({ username })
}

export async function listUser(): Promise<User[]> {
  const users = await UserModel.find().sort({ _id: -1 })

  return users.map(u => u.toObject(removeProperties))
}

export async function updateUser(
  username: string,
  { teamId, password, roles }: Partial<DbUser>,
): Promise<User> {
  if (password) {
    const user = await UserModel.findOne({ username })

    if (!user) {
      throw new Error(
        `User ${username} hasn't been updated because it was not found`,
      )
    }

    password = passwordHasher(password, user.salt)
  }

  const additional = teamId === '' ? { $unset: { teamId } } : { teamId }

  const document = await UserModel.findOneAndUpdate(
    { username },
    { roles, password, ...additional },
    { returnDocument: 'after' },
  )

  if (!document) {
    throw new Error(
      `User ${username} hasn't been updated because it was not found`,
    )
  }

  return document.toObject(removeProperties)
}
