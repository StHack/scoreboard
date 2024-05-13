process.env.DEBUG = 'express:application,socket.io:server,sthack*'
import { createAdapter } from '@socket.io/redis-adapter'
import { initMongo } from 'db/main.js'
import debug from 'debug'
import { config } from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { Redis } from 'ioredis'
import { join } from 'path'
import { registerAdminNamespace } from 'services/admin.js'
import {
  registerAuthentification,
  registerAuthentificationForSocket,
} from 'services/authentication.js'
import { registerCtfTime } from 'services/ctftime.js'
import { registerFileEndpoint } from 'services/file.js'
import { registerGameNamespace } from 'services/game.js'
import { registerPlayerNamespace } from 'services/player.js'
import { getServerConfig } from 'services/serverconfig.js'
import { registerServerStatisticsHandler } from 'services/serverStatistics.js'
import { Server } from 'socket.io'
import { redisConnectionString } from './sthack-config.js'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const app = express()
const logger = debug('sthack')

const httpServer = createServer({}, app)

const pubClient = new Redis(redisConnectionString())
const subClient = pubClient.duplicate()
const serverConfigClient = pubClient.duplicate()
const sessionClient = pubClient.duplicate()

const io = new Server(httpServer, {
  transports: ['websocket'],
  path: '/api/socket',
  maxHttpBufferSize: 15e6, // 15MB
  adapter: createAdapter(pubClient, subClient),
})

const serverConfig = getServerConfig(serverConfigClient)

await initMongo()
registerCtfTime(app, serverConfig)
registerFileEndpoint(app)
registerAuthentification(app, io, serverConfig, sessionClient)

const adminIo = io.of('/api/admin')
const gameIo = io.of('/api/game')
const playerIo = io.of('/api/player')

const serverStatFetcher = registerServerStatisticsHandler(
  adminIo,
  gameIo,
  playerIo,
)

registerAuthentificationForSocket(playerIo, sessionClient)
registerAuthentificationForSocket(adminIo, sessionClient)

registerGameNamespace(adminIo, gameIo, playerIo, serverConfig)
registerPlayerNamespace(adminIo, gameIo, playerIo, serverConfig)
registerAdminNamespace(
  adminIo,
  gameIo,
  playerIo,
  serverConfig,
  serverStatFetcher,
)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(import.meta.dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(join(import.meta.dirname, 'build', 'index.html'))
  })
}

const PORT = 4400

const opened = await serverConfig.getGameOpened()
if (opened) {
  serverStatFetcher.start()
}

httpServer.listen(PORT, () => {
  logger(
    `⚡️[server]: Server is running at %s in %s mode`,
    `http://localhost:${PORT.toString()}`,
    process.env.NODE_ENV ?? '',
  )
})
