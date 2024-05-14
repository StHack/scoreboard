import { ExecutionError, Lock, Redlock } from '@sesamecare-oss/redlock'
import { CreateUser, User as OurUser } from '@sthack/scoreboard-common'
import RedisStore from 'connect-redis'
import { getUser, login, registerUser } from 'db/UsersDb.js'
import debug from 'debug'
import { Handler, IRouter, json, Request } from 'express'
import session from 'express-session'
import { Redis } from 'ioredis'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { Namespace, Server } from 'socket.io'
import { salt } from 'sthack-config.js'
import { ServerConfig } from './serverconfig.js'

const logger = debug('sthack:authentication')

const sessionMiddleware = (sessionRedisClient: Redis) => {
  return session({
    secret: salt(),
    store: new RedisStore({ client: sessionRedisClient }),
    resave: false,
    saveUninitialized: false,
  })
}

export function registerAuthentification(
  app: IRouter,
  io: Server,
  serverConfig: ServerConfig,
  sessionRedisClient: Redis,
  redlock: Redlock,
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
          done(null, false)
          return
        }

        const gameIsOpened = await serverConfig.getGameOpened()

        if (!gameIsOpened && !user.isAdmin) {
          done(null, false)
          return
        }

        done(null, user)
        return
      } catch (error) {
        done(error)
        return
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

    const user = (req.body || {}) as CreateUser

    let lock: Lock | undefined = undefined
    const lockKey = `register-${user.team}`
    try {
      lock = await redlock.acquire([lockKey], 5_000)

      const maxTeamSize = await serverConfig.getTeamSize()
      await registerUser(user, maxTeamSize)
      res.sendStatus(201)
    } catch (error) {
      if (error instanceof ExecutionError) {
        res
          .status(400)
          .send('You were too fast for your account creation, please retry')
      } else if (error instanceof Error) {
        res.status(400).send(error.message)
      } else {
        logger('an unexpected error occured %o', error)
        res.status(500).send(error)
      }
    } finally {
      await lock?.release().catch(() => {
        logger('release of lock %s failed', lockKey)
      })
    }
  })

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.post('/api/login', passport.authenticate('local'), (req, res) =>
    res.send(req.user),
  )

  app.post('/api/logout', (req, res) => {
    const socketId = req.session.socketId

    if (socketId) {
      io.in(socketId).disconnectSockets(true)
    }

    req.logout(err => {
      res.cookie('connect.sid', '', { expires: new Date() })
      res.send('Logged out succesfully')
    })
  })

  app.get('/api/me', (req, res) => {
    if (req.isAuthenticated()) {
      res.send(req.user)
    } else {
      res.sendStatus(401)
    }
  })
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrap = (middleware: Handler) => (socket: any, next: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  middleware(socket.request, {} as any, next)
}

export function registerAuthentificationForSocket(
  io: Namespace,
  sessionRedisClient: Redis,
) {
  io.use(wrap(sessionMiddleware(sessionRedisClient)))
  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.session() as Handler))
  io.use((socket, next) => {
    ;(socket.request as Request).user ? next() : next(new Error('unauthorized'))
  })

  io.on('connect', async socket => {
    const request = socket.request as Request
    const session = request.session
    session.socketId = socket.id
    session.save()
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await socket.join(request.user!.username)
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await socket.join(request.user!.team)
  })
}

declare module 'express-session' {
  interface SessionData {
    socketId: string
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends OurUser {}
  }
}
