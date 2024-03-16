export function mongoConnectionString(): string {
  const str = process.env.APP_MONGO
  if (!str) {
    throw new Error('Mongo Connection string is missing')
  }

  return str
}

export function mongoDb(): string {
  const str = process.env.APP_MONGO_DB
  if (!str) {
    throw new Error('Mongo DB name string is missing')
  }

  return str
}

export function redisConnectionString(): string {
  const str = process.env.APP_REDIS
  if (!str) {
    throw new Error('Redis Connection string is missing')
  }

  return str
}

export function salt(): string {
  const str = process.env.APP_SALT
  if (!str) {
    throw new Error('Salt string is missing')
  }

  return str
}

export type DiscordConfig = {
  token: string
  channel: string
}
export function discordConfig(): DiscordConfig | undefined {
  const token = process.env.APP_DISCORD_TOKEN
  const channel = process.env.APP_DISCORD_CHANNEL

  return token && channel ? { token, channel } : undefined
}
