import { TimestampedServerActivityStatistics } from '@sthack/scoreboard-common'
import { createServerActivityStatistics } from 'db/ServerActivityStatisticsDb.js'
import debug from 'debug'
import { Namespace } from 'socket.io'
import { getServerActivityStatistics } from './serveractivity.js'

type ServerStatisticsFetcherCallback = (
  stats: TimestampedServerActivityStatistics,
) => void | Promise<void>

export class ServerStatisticsFetcher {
  private readonly adminIo: Namespace
  private readonly gameIo: Namespace
  private readonly playerIo: Namespace

  private readonly logger = debug('sthack:server-stats')
  private readonly intervalTime = 2 * 60 * 1000
  private readonly callbacks = new Set<ServerStatisticsFetcherCallback>()

  private interval: NodeJS.Timeout | undefined = undefined

  constructor(adminIo: Namespace, gameIo: Namespace, playerIo: Namespace) {
    this.adminIo = adminIo
    this.gameIo = gameIo
    this.playerIo = playerIo
  }

  public stop(): void {
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = undefined
      this.logger('stopped')
    }
  }

  public registerCallback(callback: ServerStatisticsFetcherCallback): void {
    this.callbacks.add(callback)
  }

  public unregisterCallback(callback: ServerStatisticsFetcherCallback): void {
    this.callbacks.delete(callback)
  }

  public async trigger() {
    const timestamped = await createServerActivityStatistics(
      getServerActivityStatistics(this.adminIo, this.gameIo, this.playerIo),
    )

    this.callbacks.forEach(calback => calback(timestamped))

    this.logger('data saved')
  }

  public start(): void {
    if (this.interval) {
      return
    }

    this.interval = setInterval(() => this.trigger(), this.intervalTime)
    this.logger('started')

    this.trigger().catch((e: unknown) => {
      this.logger('an error occured %o', e)
    })
  }
}

export function registerServerStatisticsHandler(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
) {
  return new ServerStatisticsFetcher(adminIo, gameIo, playerIo)
}
