import { connect, ToObjectOptions } from 'mongoose'
import { mongoConnectionString, mongoDb } from '../sthack-config.js'

export async function initMongo() {
  await connect(mongoConnectionString(), { dbName: mongoDb() })
}

type removeMongoPropertiesWithOptionsType = {
  removeId?: boolean
  propsToRemove?: string[]
}
export function removeMongoPropertiesWithOptions({
  removeId = true,
  propsToRemove = [],
}: removeMongoPropertiesWithOptionsType): ToObjectOptions {
  return {
    versionKey: false,
    transform: function (doc, ret) {
      // @ts-expect-error manual cleaning of mongo properties, this is not a mongoose document
      delete ret.id
      if (removeId) {
        // @ts-expect-error manual cleaning of mongo properties, this is not a mongoose document
        delete ret._id
      }
      for (const props of propsToRemove) {
        // @ts-expect-error manual cleaning of mongo properties, this is not a mongoose document
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete ret[props]
      }

      return ret
    },
  }
}

export class ValidationError extends Error {}
