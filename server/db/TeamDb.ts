import { CreateTeam, FullTeam, Team } from '@sthack/scoreboard-common'
import debug from 'debug'
import { model, Schema, ToObjectOptions } from 'mongoose'
import { nanoid } from 'nanoid'
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

schema.index({ joinToken: 1 }, { unique: true })

const TeamModel = model<FullTeam>('Team', schema)

const toTeam: ToObjectOptions = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: ['joinToken'],
})

const toFullTeam: ToObjectOptions = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: [],
})

export async function createTeam({ name }: CreateTeam): Promise<FullTeam> {
  try {
    const doc = new TeamModel({
      name,
      joinToken: nanoid(8),
    })

    await doc.save()
    return doc.toObject(toFullTeam)
  } catch (error) {
    if (error instanceof global.Error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
      if (error.name === 'MongoServerError' && (error as any).code === 11000) {
        throw new Error(
          'This team already exist, you need to join it with the token your mate is going to share with you',
        )
      }
    }

    logger('Unexpected error %o', error)
    throw new Error('an unexpected error occured')
  }
}

export async function getTeam(id: string): Promise<Team | undefined> {
  const team = await TeamModel.findById(id)
  return team?.toObject(toTeam)
}

export async function getFullTeam(id: string): Promise<FullTeam | undefined> {
  const team = await TeamModel.findById(id)
  return team?.toObject(toFullTeam)
}

export async function getTeamByJoinToken(
  joinToken: string,
): Promise<FullTeam | undefined> {
  const team = await TeamModel.findOne({ joinToken })
  return team?.toObject(toFullTeam)
}

export async function removeTeam(id: string): Promise<Team | undefined> {
  const deleted = await TeamModel.findByIdAndDelete(id)
  return deleted?.toObject(toTeam)
}

export async function listTeam(): Promise<Team[]> {
  const teams = await TeamModel.find().sort({ _id: -1 })
  return teams.map(u => u.toObject(toTeam))
}

export async function listFullTeam(): Promise<FullTeam[]> {
  const teams = await TeamModel.find().sort({ _id: -1 })
  return teams.map(u => u.toObject(toFullTeam))
}

export async function countTeam(): Promise<number> {
  return await TeamModel.countDocuments()
}
