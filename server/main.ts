process.env.DEBUG = 'express:application,socket.io:server,sthack*'
import { createAdapter } from '@socket.io/redis-adapter'
import { initMongo } from 'db/main.js'
import debug from 'debug'
import { config } from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import { join } from 'path'
import { createClient, RedisClientType } from 'redis'
import { registerAdminNamespace } from 'services/admin.js'
import {
  registerAuthentification,
  registerAuthentificationForSocket,
} from 'services/authentication.js'
import { registerCtfTime } from 'services/ctftime.js'
import { registerGameNamespace } from 'services/game.js'
import { registerPlayerNamespace } from 'services/player.js'
import { getServerConfig } from 'services/serverconfig.js'
import { Server } from 'socket.io'
import { redisConnectionString } from 'sthack-config.js'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const app = express()
const logger = debug('sthack')

const httpServer = createServer({}, app)

const io = new Server(httpServer, {
  transports: ['websocket'],
  path: '/api/socket',
})
const pubClient = createClient({ url: redisConnectionString() })
const subClient = pubClient.duplicate()
const serverConfigClient = pubClient.duplicate() as RedisClientType
const sessionClient = pubClient.duplicate() as RedisClientType

const serverConfig = getServerConfig(serverConfigClient)

await initMongo()
registerCtfTime(app, serverConfig)
registerAuthentification(app, io, serverConfig, sessionClient)

const adminIo = io.of('/api/admin')
const gameIo = io.of('/api/game')
const playerIo = io.of('/api/player')

registerAuthentificationForSocket(playerIo, sessionClient)
registerAuthentificationForSocket(adminIo, sessionClient)

registerGameNamespace(adminIo, gameIo, playerIo, serverConfig)
registerPlayerNamespace(adminIo, gameIo, playerIo, serverConfig)
registerAdminNamespace(adminIo, gameIo, playerIo, serverConfig)

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(import.meta.dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(join(import.meta.dirname, 'build', 'index.html'))
  })
}

const PORT = 4400

await Promise.all([
  pubClient.connect(),
  subClient.connect(),
  serverConfigClient.connect(),
  sessionClient.connect(),
]).then(() => {
  io.adapter(createAdapter(pubClient, subClient))

  httpServer.listen(PORT, () => {
    console.log(
      `⚡️[server]: Server is running at http://localhost:${PORT.toString()} in ${process.env.NODE_ENV ?? ''} mode`,
    )
  })
})
