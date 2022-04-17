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

  public async getTeamSize(): Promise<number> {
    const isOpenedStr = await this.redisClient.hGet('serverConfig', 'teamSize') ?? '5'
    return JSON.parse(isOpenedStr)
  }

  public async setTeamSize(teamSize: number) : Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'teamSize',
      JSON.stringify(teamSize.toString()),
    )
  }
}

export function getServerConfig(redisClient: RedisClientType) {
  return new ServerConfig(redisClient)
}
