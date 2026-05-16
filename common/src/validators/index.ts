import { z, ZodError } from 'zod'

export * from './Survey.js'
export * from './Team.js'
export * from './Users.js'

export const formatZodError = (errors: ZodError) => z.prettifyError(errors)
