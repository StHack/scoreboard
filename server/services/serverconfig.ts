import { countTeam } from 'db/UsersDb'
import { GameConfig } from 'models/GameConfig'
import { RedisClientType } from 'redis'

const delayTimeInMinutes = 10

export class ServerConfig {
  redisClient: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient
  }

  public async getRegistrationClosed(): Promise<boolean> {
    const isOpenedStr = await this.redisClient.hGet(
      'serverConfig',
      'registrationClosed',
    )
    return JSON.parse(isOpenedStr ?? 'false')
  }

  public async setRegistrationClosed(status: boolean): Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'registrationClosed',
      JSON.stringify(status),
    )
  }

  public async getGameOpened(): Promise<boolean> {
    const isOpenedStr = await this.redisClient.hGet(
      'serverConfig',
      'gameOpened',
    )
    return JSON.parse(isOpenedStr ?? 'false')
  }

  public async setGameOpened(status: boolean): Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'gameOpened',
      JSON.stringify(status),
    )
  }

  public async getTeamSize(): Promise<number> {
    const teamSizeStr = await this.redisClient.hGet('serverConfig', 'teamSize')
    return teamSizeStr ? parseInt(teamSizeStr) : 5
  }

  public async setTeamSize(teamSize: number): Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'teamSize',
      teamSize,
    )
  }

  public async getGameConfig(): Promise<GameConfig> {
    const teamCount = await countTeam()
    const teamSize = await this.getTeamSize()

    return {
      solveDelay: delayTimeInMinutes * 60 * 1000,
      teamCount,
      baseChallScore: 50,
      teamSize,
    }
  }
}

export function getServerConfig(redisClient: RedisClientType) {
  return new ServerConfig(redisClient)
}
