import RedisStore from 'connect-redis'
import { getUser, login, registerUser } from 'db/UsersDb'
import { IRouter, json, Request } from 'express'
import session from 'express-session'
import { CreateUser, User as OurUser } from 'models/User'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { RedisClientType } from 'redis'
import { Namespace, Server } from 'socket.io'
import { salt } from 'sthack-config'
import { ServerConfig } from './serverconfig'

const sessionMiddleware = (sessionRedisClient: RedisClientType) => {
  const RedisS = RedisStore(session)
  return session({
    secret: salt(),
    store: new RedisS({ client: sessionRedisClient }),
    resave: false,
    saveUninitialized: false,
  })
}

export function registerAuthentification(
  app: IRouter,
  io: Server,
  serverConfig: ServerConfig,
  sessionRedisClient: RedisClientType,
) {
  app.use(sessionMiddleware(sessionRedisClient))
  app.use(json())
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const user = await login(username, password)

        if (!user) {
          return done(null, false)
        }

        const gameIsOpened = await serverConfig.getGameOpened()

        if (!gameIsOpened && !user.isAdmin) {
          return done(null, false)
        }

        return done(null, user)
      } catch (error) {
        return done(error)
      }
    }),
  )

  passport.serializeUser<string>((user, done) => {
    done(null, user.username)
  })

  passport.deserializeUser<string>(async (username, done) => {
    const user = await getUser(username)
    done(null, user ?? false)
  })

  app.post('/api/register', async (req, res) => {
    if (req.isAuthenticated()) {
      res.status(400).send('You are already authenticated')
      return
    }

    try {
      const isClosed = await serverConfig.getRegistrationClosed()

      if (isClosed) {
        res.status(400).send('registration closed')
        return
      }
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message)
      } else {
        res.status(500).send(error)
      }
      return
    }

    try {
      const maxTeamSize = await serverConfig.getTeamSize()
      await registerUser((req.body || {}) as CreateUser, maxTeamSize)
      res.sendStatus(201)
    } catch (error) {
      if (error instanceof Error) {
        res.status(400).send(error.message)
      } else {
        res.status(500).send(error)
      }
      return
    }
  })

  app.post(
    '/api/login',
    passport.authenticate('local', {
      // session: false,
    }),
    (req, res) => res.send(req.user),
  )

  app.post('/api/logout', (req, res) => {
    const socketId = req.session.socketId

    if (socketId) {
      io.in(socketId)?.disconnectSockets(true)
    }

    req.logout()
    res.cookie('connect.sid', '', { expires: new Date() })
    res.send('Logged out succesfully')
  })

  app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user)
    } else {
      res.sendStatus(401)
    }
  })
}

const wrap = (middleware: any) => (socket: any, next: any) =>
  middleware(socket.request, {}, next)

export function registerAuthentificationForSocket(io: Namespace, sessionRedisClient: RedisClientType) {
  io.use(wrap(sessionMiddleware(sessionRedisClient)))
  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.session()))
  io.use((socket, next) =>
    (socket.request as Request).user ? next() : next(new Error('unauthorized')),
  )

  io.on('connect', socket => {
    const request = socket.request as Request
    const session = request.session
    session.socketId = socket.id
    session.save()
    socket.join(request.user!.username)
    socket.join(request.user!.team)
  })
}

declare module 'express-session' {
  interface SessionData {
    socketId: string
  }
}

declare global {
  namespace Express {
    interface User extends OurUser {}
  }
}
