import { BaseReward, Reward } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Reward>(
  {
    teamId: { type: String, required: true },
    label: { type: String, required: true },
    value: { type: Number, required: true },
  },
  { timestamps: true },
)

const RewardModel = model<Reward>('Reward', schema)

export async function createReward(reward: BaseReward): Promise<Reward> {
  const doc = new RewardModel(reward)
  await doc.save()

  return doc.toObject(removeMongoPropertiesWithOptions({ removeId: false }))
}

export async function listReward(): Promise<Reward[]> {
  const results = await RewardModel.find().sort({ updatedAt: -1 })

  return results.map(r =>
    r.toObject(removeMongoPropertiesWithOptions({ removeId: false })),
  )
}

export async function removeReward(id: string): Promise<Reward | undefined> {
  const deleted = await RewardModel.findOneAndDelete({ _id: id })
  return deleted?.toObject(
    removeMongoPropertiesWithOptions({ removeId: false }),
  )
}
