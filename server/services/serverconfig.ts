import { GameConfig } from '@sthack/scoreboard-common'
import { countTeam } from 'db/UsersDb.js'
import { RedisClientType } from 'redis'

export class ServerConfig {
  redisClient: RedisClientType

  constructor(redisClient: RedisClientType) {
    this.redisClient = redisClient
  }

  public async getRegistrationClosed(): Promise<boolean> {
    const str = await this.redisClient.hGet(
      'serverConfig',
      'registrationClosed',
    )
    return JSON.parse(str ?? 'false') as boolean
  }

  public async setRegistrationClosed(status: boolean): Promise<void> {
    await this.redisClient.hSet(
      'serverConfig',
      'registrationClosed',
      JSON.stringify(status),
    )
  }

  public async getGameOpened(): Promise<boolean> {
    const str = await this.redisClient.hGet('serverConfig', 'gameOpened')
    return JSON.parse(str ?? 'false') as boolean
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
    await this.redisClient.hSet('serverConfig', 'teamSize', teamSize)
  }

  public async getGameConfig(): Promise<GameConfig> {
    const [teamCount, teamSize, registrationClosed, gameOpened] =
      await Promise.all([
        countTeam(),
        this.getTeamSize(),
        this.getRegistrationClosed(),
        this.getGameOpened(),
      ])

    return {
      registrationOpened: !registrationClosed,
      gameOpened: gameOpened,
      teamCount,
      baseChallScore: 50,
      teamSize,
    }
  }
}

export function getServerConfig(redisClient: RedisClientType) {
  return new ServerConfig(redisClient)
}
