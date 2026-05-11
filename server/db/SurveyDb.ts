import { Survey } from '@sthack/scoreboard-common'
import { model, Schema } from 'mongoose'
import { removeMongoPropertiesWithOptions } from './main.js'

const schema = new Schema<Survey>(
  {
    achievementId: { type: String, required: true },

    challengeId: { type: String, required: true },
    teamname: { type: String, required: true },
    username: { type: String, required: true },
    satisfaction: { type: Number, required: true },
    perceivedDifficulty: { type: Number, required: true },
    aiUsage: { type: Number, required: true },
    feedback: { type: String, required: false },
  },
  {
    timestamps: true,
  },
)

schema.index({ achievementId: 1 }, { unique: true })
schema.index({ challengeId: 1, teamname: 1 }, { unique: true })

const SurveyModel = model<Survey>('Survey', schema)

const removeMongoProperties = removeMongoPropertiesWithOptions({
  removeId: false,
  propsToRemove: [],
})

export async function createSurvey(
  survey: Omit<Survey, '_id' | 'challenge' | 'achievement' | 'createdAt'>,
): Promise<Survey> {
  const doc = new SurveyModel(survey)
  await doc.save()
  return doc.toObject(removeMongoProperties)
}

type listSurveyParams = {
  includeFeedback?: boolean
}
export async function listSurvey({
  includeFeedback,
}: listSurveyParams = {}): Promise<Survey[]> {
  const results = await SurveyModel.find()
    .select(includeFeedback ? [] : ['-feedback'])
    .sort({ updatedAt: -1 })
  return results.map(r => r.toObject(removeMongoProperties))
}

export async function getSurvey(
  achievementId: string,
): Promise<Survey | undefined> {
  const doc = await SurveyModel.findOne({ achievementId })
  return doc?.toObject(removeMongoProperties)
}

export async function removeSurveyById(
  surveyId: string,
): Promise<Survey | undefined> {
  const deleted = await SurveyModel.findByIdAndDelete(surveyId)
  return deleted?.toObject(removeMongoProperties)
}

export async function removeSurveyByAchievementId(
  achievementId: string,
): Promise<Survey | undefined> {
  const deleted = await SurveyModel.findOneAndDelete({
    achievementId,
  })
  return deleted?.toObject(removeMongoProperties)
}
