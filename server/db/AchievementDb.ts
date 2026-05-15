import { Achievement, BaseAchievement, Survey } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Achievement>(
  {
    challengeId: { type: String, required: true },
    username: { type: String, required: true },
    teamId: { type: String, required: true },
  },
  { timestamps: true },
)

schema.index({ challengeId: 1, teamId: 1 }, { unique: true })

const AchievementModel = model<Achievement>('Achievement', schema)

const removeMongoProperties = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: [],
})

export async function registerAchievement(
  achievement: BaseAchievement,
): Promise<Achievement> {
  const doc = new AchievementModel(achievement)
  await doc.save()

  return doc.toObject(removeMongoProperties)
}

export async function listAchievement(): Promise<Achievement[]> {
  const results = await AchievementModel.find().sort({ updatedAt: -1 })
  return results.map(r => r.toObject(removeMongoProperties))
}

export async function getAchievementBySolveIds(
  challengeId: string,
  teamId: string,
): Promise<Achievement | undefined> {
  const doc = await AchievementModel.findOne({ challengeId, teamId })
  return doc?.toObject(removeMongoProperties)
}

export async function countChallengeAchievement(
  challengeId: string,
): Promise<number> {
  return await AchievementModel.countDocuments({ challengeId })
}

export async function removeAchievement(
  teamId: string,
  challengeId: string,
): Promise<Achievement | undefined> {
  const deleted = await AchievementModel.findOneAndDelete({
    teamId,
    challengeId,
  })
  return deleted?.toObject(removeMongoProperties)
}
