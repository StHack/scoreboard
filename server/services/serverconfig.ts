import { RedisClientType } from 'redis'

export class ServerConfig {
  redisClient: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient
  }

  public async getRegistrationClosed(): Promise<boolean> {
    const isOpenedStr = await this.redisClient.hGet('serverConfig', 'registrationClosed') ?? 'false'
    return JSON.parse(isOpenedStr)
  }

  public async setRegistrationClosed(status: boolean) : Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'registrationClosed',
      JSON.stringify(status),
    )
  }
}

export function getServerConfig(redisClient: RedisClientType) {
  return new ServerConfig(redisClient)
}
