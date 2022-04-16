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

  public async getGameOpened(): Promise<boolean> {
    const isOpenedStr = await this.redisClient.hGet('serverConfig', 'gameOpened') ?? 'false'
    return JSON.parse(isOpenedStr)
  }

  public async setGameOpened(status: boolean) : Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'gameOpened',
      JSON.stringify(status),
    )
  }
}

export function getServerConfig(redisClient: RedisClientType) {
  return new ServerConfig(redisClient)
}
