import { z } from 'zod'
import { CreateSurvey, Survey } from '../models/Survey.js'

export const schemaSurvey = z.object({
  satisfaction: z.number().gt(1).lte(5),
  perceivedDifficulty: z.number().gt(1).lte(5),
  aiUsage: z.number().gt(1).lte(5),
  feedback: z.string().max(2000).optional(),
}) satisfies z.ZodType<Survey>

export const schemaCreateSurvey = z.object({
  challengeId: z.string(),
  survey: schemaSurvey,
}) satisfies z.ZodType<CreateSurvey>
