import {
  isPlayer,
  schemaCreateUser,
  User as OurUser,
  UserRole,
} from '@sthack/scoreboard-common'
import { RedisStore } from 'connect-redis'
import { ValidationError } from 'db/main.js'
import { getTeam } from 'db/TeamDb.js'
import { getTeamPlayers, getUser, login, registerUser } from 'db/UsersDb.js'
import debug from 'debug'
import { Handler, IRouter, json, Request, RequestHandler } from 'express'
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
) {
  app.use(sessionMiddleware(sessionRedisClient))
  app.use(json())
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

        if (!gameIsOpened && !user.roles.includes(UserRole.Admin)) {
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
    if (!user) {
      done(null, false)
      return
    }

    if (!isPlayer(user)) {
      done(null, user)
      return
    }

    const team = await getTeam(user.teamId)
    if (!team) {
      done(null, user)
      return
    }

    done(null, { ...user, teamname: team.name })
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

    const validations = schemaCreateUser.safeParse(req.body || {})

    if (validations.error) {
      res.status(400).send('Validations error')
      return
    }

    try {
      await registerUser(validations.data)
      res.sendStatus(201)
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).send(error.message)
      } else {
        logger('an unexpected error occured %o', error)
        res.status(500).send('An error happened')
      }
    }
  })

  const meHandler: RequestHandler = async (req, res) => {
    if (!req.user) {
      res.sendStatus(401)
      return
    }

    if (!req.isAuthenticated()) {
      res.sendStatus(401)
      return
    }

    if (!isPlayer(req.user)) {
      res.send(req.user)
      return
    }

    const team = await getTeam(req.user.teamId)
    if (!team) {
      res.send(req.user)
      return
    }

    const others = await getTeamPlayers(req.user.teamId)
    team.players = others.filter(isPlayer)

    res.send({
      ...req.user,
      team,
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  app.post('/api/login', passport.authenticate('local'), meHandler)

  app.post('/api/logout', (req, res) => {
    const user = req.user

    if (user) {
      io.in(user.username).disconnectSockets(true)
    }

    req.logout(() => {
      res.cookie('connect.sid', '', { expires: new Date() })
      res.send('Logged out succesfully')
    })
  })

  app.get('/api/me', meHandler)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const wrap = (middleware: Handler) => async (socket: any, next: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  await middleware(socket.request, {} as any, next)
}

export function registerAuthentificationForSocket(
  io: Namespace,
  sessionRedisClient: Redis,
) {
  io.use(wrap(sessionMiddleware(sessionRedisClient)))
  io.use(wrap(passport.initialize()))
  io.use(wrap(passport.session() as Handler))
  io.use((socket, next) => {
    next(
      (socket.request as Request).user ? undefined : new Error('unauthorized'),
    )
  })

  io.on('connect', async socket => {
    const request = socket.request as Request
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    await socket.join(request.user!.username)
  })
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface User extends OurUser {
      teamname?: string
    }
  }
}
