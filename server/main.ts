import { createAdapter } from '@socket.io/redis-adapter'
import { initMongo } from 'db/main'
import { config } from 'dotenv'
import express from 'express'
import { readFileSync } from 'fs'
import { createServer } from 'https'
import { join } from 'path'
import { createClient } from 'redis'
import { registerAdminNamespace } from 'services/admin'
import {
  registerAuthentification,
  registerAuthentificationForSocket,
} from 'services/authentication'
import { registerGameNamespace } from 'services/game'
import { Server } from 'socket.io'
import { redisConnectionString } from 'sthack-config'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const app = express()

const key = readFileSync(__dirname + '/key.pem')
const cert = readFileSync(__dirname + '/cert.pem')

const httpServer = createServer({ key, cert }, app)

const io = new Server(httpServer, {
  transports: ['websocket'],
  path: '/api/socket',
})
const pubClient = createClient({ url: redisConnectionString() })
const subClient = pubClient.duplicate()
io.adapter(createAdapter(pubClient, subClient))

initMongo()
registerAuthentification(app, io)

registerAuthentificationForSocket(io.of('/api/game'))
registerAuthentificationForSocket(io.of('/api/admin'))

registerGameNamespace(io.of('/api/game'))
registerAdminNamespace(io.of('/api/admin'), io.of('/api/game'))

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, 'build')))
  app.get('/*', function (req, res) {
    res.sendFile(join(__dirname, 'build', 'index.html'))
  })
}

const PORT = 4400

httpServer.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  )
})
