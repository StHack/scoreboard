import { RedisClient } from 'redis'

export class ServerConfig {
  redisClient: RedisClient

  constructor(redisClient: RedisClient) {
    this.redisClient = redisClient
  }

  public async getRegistrationClosed(): Promise<boolean> {
    const isOpened = await new Promise<boolean>((resolve, reject) =>
      this.redisClient.hget('serverConfig', 'registrationClosed', (err, str) =>
        err ? reject(err) : resolve(JSON.parse(str ?? 'false')),
      ),
    )

    return isOpened
  }

  public setRegistrationClosed(status: boolean) {
    this.redisClient.hset(
      'serverConfig',
      'registrationClosed',
      JSON.stringify(status),
    )
  }
}

export function getServerConfig(redisClient: RedisClient) {
  return new ServerConfig(redisClient)
}
