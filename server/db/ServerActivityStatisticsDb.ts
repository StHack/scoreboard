import {
  ServerActivityStatistics,
  TimestampedServerActivityStatistics,
} from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<TimestampedServerActivityStatistics>(
  {
    timestamp: Date,
    teams: { type: Schema.Types.Mixed },
    admins: { type: Schema.Types.Mixed },
    teamCount: { type: Number },
    userCount: { type: Number },
    sockets: { type: Schema.Types.Mixed },
  },
  {
    timeseries: {
      timeField: 'timestamp',
      granularity: 'seconds',
      bucketMaxSpanSeconds: 3600, // 1 hours bucket
    },
  },
)

const ServerActivityStatisticsModel =
  model<TimestampedServerActivityStatistics>('ServerActivityStatistics', schema)

export async function createServerActivityStatistics(
  serverActivityStatistics: ServerActivityStatistics,
): Promise<TimestampedServerActivityStatistics> {
  const doc = new ServerActivityStatisticsModel({
    timestamp: new Date(),
    ...serverActivityStatistics,
  })
  await doc.save()

  return doc.toObject(removeMongoPropertiesWithOptions({ removeId: true }))
}

export async function listServerActivityStatistics(): Promise<
  TimestampedServerActivityStatistics[]
> {
  const results = await ServerActivityStatisticsModel.find(
    {},
    {
      admins: 0,
      teams: 0,
      updatedAt: 0,
      _id: 0,
    },
  )

  return results.map(r =>
    r.toObject(removeMongoPropertiesWithOptions({ removeId: true })),
  )
}

export async function removeAllServerActivityStatistics(): Promise<void> {
  await ServerActivityStatisticsModel.deleteMany({})
}
