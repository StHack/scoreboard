import { z } from 'zod'
import { CreateTeam, JoinTeam } from '../models/Team.js'
import { bannedStartingCharacters, unauthorizedWords } from './Users.js'

export const schemaCreateTeam = z.object({
  name: z
    .string()
    .min(3)
    .max(42)
    .refine(
      val =>
        !unauthorizedWords.find(w =>
          val.normalize('NFKC').toLocaleLowerCase().includes(w),
        ),
      {
        error: 'Unauthorized words',
      },
    )
    .refine(
      val =>
        !bannedStartingCharacters.find(c =>
          val.normalize('NFKC').toLocaleLowerCase().startsWith(c),
        ),
      { error: 'Invalid starting characters' },
    ),
}) satisfies z.ZodType<CreateTeam>

export const schemaJoinTeam = z.object({
  joinToken: z.nanoid({ pattern: /[A-Za-z0-9_-]*/ }).length(8),
}) satisfies z.ZodType<JoinTeam>
