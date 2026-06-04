import { z } from 'zod'
import { CreateUser } from '../models/User.js'

export const schemaCreateUser = z.object({
  username: z
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
  password: z.string().min(5),
}) satisfies z.ZodType<CreateUser>

export const unauthorizedWords = [
  '__proto__',
  'constructor',
  'prototype',
  '`',
  '@everyone',
  '@here',
  'admin',
]

export const bannedStartingCharacters = ['@', 'u/', 'u-', 't/', 't-']
