import { Achievement, BaseAchievement } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Achievement>(
  {
    challengeId: { type: String, required: true },
    username: { type: String, required: true },
    teamname: { type: String, required: true },
  },
  { timestamps: true },
)

schema.index({ challengeId: 1, teamname: 1 }, { unique: true })

const AchievementModel = model<Achievement>('Achievement', schema)

const removeMongoProperties = removeMongoPropertiesWithOptions({
  removeId: true,
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

export async function getTeamAchievement(
  teamname: string,
): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ teamname }).sort({ updatedAt: -1 })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function countChallengeAchievement(
  challengeId: string,
): Promise<number> {
  return await AchievementModel.countDocuments({ challengeId })
}

export async function getChallengeAchievement(
  challengeId: string,
): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ challengeId }).sort({
    updatedAt: -1,
  })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function getUserAchievement(
  username: string,
): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ username }).sort({ updatedAt: -1 })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function removeAllTeamAchievement(
  teamname: string,
): Promise<void> {
  await AchievementModel.deleteMany({ teamname })
}

export async function removeAchievement(
  teamname: string,
  challengeId: string,
): Promise<Achievement | undefined> {
  const deleted = await AchievementModel.findOneAndDelete({
    teamname,
    challengeId,
  })
  return deleted?.toObject(removeMongoProperties)
}
