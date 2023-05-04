import { mongoConnectionString, mongoDb } from '../sthack-config'
import { connect, ToObjectOptions } from 'mongoose'

export async function initMongo() {
  await connect(mongoConnectionString(), { dbName: mongoDb() })
}

export const removeMongoProperties: ToObjectOptions =
  removeMongoPropertiesWithOptions({
    removeId: true,
  })

type removeMongoPropertiesWithOptionsType = {
  removeId: boolean
}
export function removeMongoPropertiesWithOptions({
  removeId = true,
}: removeMongoPropertiesWithOptionsType): ToObjectOptions {
  return {
    versionKey: false,
    transform: function (doc, ret) {
      delete ret.id
      removeId && delete ret._id
      return ret
    },
  }
}
