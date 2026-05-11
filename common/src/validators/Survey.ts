import { z } from 'zod'
import { BaseSurvey } from '../models/Survey.js'

export const schemaBaseSurvey = z.object({
  satisfaction: z.number().gte(1).lte(5),
  perceivedDifficulty: z.number().gte(1).lte(5),
  aiUsage: z.number().gte(1).lte(5),
  feedback: z.string().max(2000).optional(),
}) satisfies z.ZodType<BaseSurvey>
