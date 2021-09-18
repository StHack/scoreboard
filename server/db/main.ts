import { mongoConnectionString } from '../sthack-config'
import { connect, ToObjectOptions } from 'mongoose'

export async function init() {
  await connect(mongoConnectionString())
}

export const removeMongoProperties: ToObjectOptions = {
  versionKey: false,
  transform: function (doc, ret) {
    delete ret.id
    delete ret._id
    return ret
  },
}
