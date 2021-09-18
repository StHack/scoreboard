import { createHash } from 'crypto'
import { CreateUser, User } from 'models/User'
import { Schema, model } from 'mongoose'

const schema = new Schema<User>({
  username: { type: String, required: true, minlength: 5, unique: true },
  password: { type: String, required: true, minlength: 5 },
  team: { type: String, required: true, minlength: 5 },
  isAdmin: { type: Boolean, required: true },
})

const UserModel = model<User>('User', schema)

const passwordHasher = (password: string) =>
  createHash('sha256').update(password).digest('hex')

export async function register(user: CreateUser): Promise<void> {
  const password = passwordHasher(user.password)

  const doc = new UserModel({
    ...user,
    password,
    isAdmin: false,
  })

  await doc.save()
}

export async function login(
  username: string,
  password: string,
): Promise<boolean> {
  const result = await UserModel.findOne({ username })

  if (!result) {
    return false
  }

  const hash = passwordHasher(password)

  return result.password === hash
}

export async function removeUser(username: string) : Promise<void> {
  await UserModel.findOneAndDelete({ name: username })
}
