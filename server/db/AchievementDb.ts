import { Achievement, BaseAchievement } from 'models/Achievement'
import { Schema, model } from 'mongoose'
import { removeMongoProperties } from './main'

const schema = new Schema<Achievement>({
  challenge: { type: String, required: true },
  username: { type: String, required: true },
  teamname: { type: String, required: true },
}, { timestamps: true })

const AchievementModel = model<Achievement>('Achievement', schema)

export async function registerAchievement(
  achievement: BaseAchievement,
): Promise<Achievement> {
  const { challenge, teamname } = achievement

  const alreadyAchieved = await AchievementModel.findOne({
    challenge,
    teamname,
  })

  if (alreadyAchieved) {
    return alreadyAchieved.toObject(removeMongoProperties)
  }

  const doc = new AchievementModel(achievement)
  await doc.save()

  return doc.toObject(removeMongoProperties)
}

export async function listAchievement(): Promise<Achievement[]> {
  const results = await AchievementModel.find()

  return results.map(r => r.toObject(removeMongoProperties))
}

export async function getTeamAchievement(teamname: string): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ teamname })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function getChallengeAchievement(challenge: string): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ challenge })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function getUserAchievement(username: string): Promise<Achievement[]> {
  const docs = await AchievementModel.find({ username })
  return docs.map(d => d.toObject(removeMongoProperties))
}

export async function removeAllTeamAchievement(teamname: string): Promise<void> {
  await AchievementModel.deleteMany({ teamname })
}
