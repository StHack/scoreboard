import { mongoConnectionString, mongoDb } from '../sthack-config'
import { connect, ToObjectOptions } from 'mongoose'

export async function initMongo() {
  await connect(mongoConnectionString(), { dbName: mongoDb() })
}

export const removeMongoProperties: ToObjectOptions = {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id
    delete ret._id
    return ret
  },
}
