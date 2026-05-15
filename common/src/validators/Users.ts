import { z } from 'zod'
import { CreateUser } from '../models/User.js'

export const schemaCreateUser = z.object({
  username: z
    .string()
    .min(3)
    .max(42)
    .refine(val => !unauthorizedWords.has(val.toLocaleLowerCase()), {
      error: 'Unauthorized words',
    })
    .refine(
      val =>
        !bannedStartingCharacters.find(c =>
          val.toLocaleLowerCase().startsWith(c),
        ),
      { error: 'Invalid starting characters' },
    ),
  password: z.string().min(5),
}) satisfies z.ZodType<CreateUser>

const unauthorizedWords = new Set([
  '__proto__',
  'constructor',
  'prototype',
  '`',
  '@everyone',
  '@here',
  'admin',
])

const bannedStartingCharacters = ['@', 'u/', 'u-', 't/', 't-']
