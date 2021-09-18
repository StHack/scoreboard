import { registerAuthentification } from 'services/authentication'
import { config } from 'dotenv'
import express from 'express'
import { readFileSync } from 'fs'
import { createServer } from 'https'
import { Server } from 'socket.io'
import { initMongo } from 'db/main'

if (process.env.NODE_ENV !== 'production') {
  config()
}

const app = express()

const key = readFileSync(__dirname + '/key.pem')
const cert = readFileSync(__dirname + '/cert.pem')

const httpServer = createServer({ key, cert }, app)

const io = new Server(httpServer, {
  transports: ['websocket'],
})

initMongo()
registerAuthentification(app, io)

io.on('connection', socket => {
  socket.emit('hello', 'world')
})

app.get('/', (req, res) => res.send('Express + TypeScript Server'))

const PORT = 4400

httpServer.listen(PORT, () => {
  console.log(
    `⚡️[server]: Server is running at https://localhost:${PORT} in ${process.env.NODE_ENV} mode`,
  )
})
