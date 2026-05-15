import { FullTeam, Team } from '@sthack/scoreboard-common'
import { randomUUID } from 'crypto'
import debug from 'debug'
import { model, Schema, ToObjectOptions } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const logger = debug('Db:Team')

const schema = new Schema<FullTeam>({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 42,
    unique: true,
  },
  joinToken: { type: String, required: true },
})

const TeamModel = model<FullTeam>('Team', schema)

const removeProperties: ToObjectOptions = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: [],
})

export async function createTeam({ name }: Team): Promise<FullTeam> {
  try {
    const doc = new TeamModel({
      name,
      joinToken: randomUUID(),
    })

    await doc.save()
    return doc.toObject(removeProperties)
  } catch (error) {
    if (error instanceof global.Error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        throw new Error('Team already used')
      }
    }

    logger('Unexpected error %o', error)
    throw new Error('an unexpected error occured')
  }
}

export async function getTeam(id: string): Promise<FullTeam | undefined> {
  const team = await TeamModel.findById(id)
  return team?.toObject(removeProperties)
}

export async function removeTeam(id: string): Promise<void> {
  await TeamModel.findByIdAndDelete(id)
}

type listTeamParams = {
  includeJoinToken?: boolean
}
export async function listTeam({
  includeJoinToken,
}: listTeamParams = {}): Promise<FullTeam[]> {
  const teams = await TeamModel.find()
    .select(includeJoinToken ? [] : ['-joinToken'])
    .sort({ _id: -1 })

  return teams.map(u => u.toObject(removeProperties))
}

export async function countTeam(): Promise<number> {
  return await TeamModel.countDocuments()
}
