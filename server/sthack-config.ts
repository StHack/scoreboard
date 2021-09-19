export function mongoConnectionString(): string {
  const str = process.env.APP_MONGO
  if (!str) {
    throw new Error('Mongo Connection string is missing')
  }

  return str
}

export function redisConnectionString(): string {
  const str = process.env.APP_REDIS
  if (!str) {
    throw new Error('Mongo Connection string is missing')
  }

  return str
}
