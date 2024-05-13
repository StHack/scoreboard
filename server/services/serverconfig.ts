import { GameConfig } from '@sthack/scoreboard-common'
import { countTeam } from 'db/UsersDb.js'
import { Redis } from 'ioredis'

export class ServerConfig {
  redisClient: Redis

  constructor(redisClient: Redis) {
    this.redisClient = redisClient
  }

  public async getRegistrationClosed(): Promise<boolean> {
    const str = await this.redisClient.hget(
      'serverConfig',
      'registrationClosed',
    )
    return JSON.parse(str ?? 'false') as boolean
  }

  public async setRegistrationClosed(status: boolean): Promise<void> {
    await this.redisClient.hset(
      'serverConfig',
      'registrationClosed',
      JSON.stringify(status),
    )
  }

  public async getGameOpened(): Promise<boolean> {
    const str = await this.redisClient.hget('serverConfig', 'gameOpened')
    return JSON.parse(str ?? 'false') as boolean
  }

  public async setGameOpened(status: boolean): Promise<void> {
    await this.redisClient.hset(
      'serverConfig',
      'gameOpened',
      JSON.stringify(status),
    )
  }

  public async getTeamSize(): Promise<number> {
    const teamSizeStr = await this.redisClient.hget('serverConfig', 'teamSize')
    return teamSizeStr ? parseInt(teamSizeStr) : 5
  }

  public async setTeamSize(teamSize: number): Promise<void> {
    await this.redisClient.hset('serverConfig', 'teamSize', teamSize)
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

export function getServerConfig(redisClient: Redis) {
  return new ServerConfig(redisClient)
}
