import { User, UserRole } from '@sthack/scoreboard-common'
import { Debugger } from 'debug'
import { Request } from 'express'
import { DefaultEventsMap, Namespace, Socket } from 'socket.io'

export function registerSocketLogger(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
  logger: Debugger,
) {
  socket.use(([event, ...args], next) => {
    logger(
      '%s\t%s\t%s\t%o',
      socket.conn.transport.sid,
      (socket.request as Request<User>).user?.username,
      event,
      args,
    )
    next()
  })
}

export function registerNamespaceRequiredRoles(
  ns: Namespace<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
  logger: Debugger,
  requiredRole: UserRole[],
  requiredMode: 'all' | 'any',
) {
  const requiredRoleSet = new Set(requiredRole)

  ns.use((socket, next) => {
    const user = (socket.request as Request<User>).user
    const userRoles = new Set(user?.roles ?? [])

    const isAllowed =
      requiredMode === 'all'
        ? requiredRoleSet.intersection(userRoles).size === requiredRoleSet.size
        : requiredRoleSet.intersection(userRoles).size > 0

    if (isAllowed) {
      next()
    } else {
      logger(
        '%s\t%s\t%s\t%s',
        socket.conn.transport.sid,
        user?.username,
        'Unauthorized',
        socket.nsp.name,
      )
      next(new Error(`Unauthorized: ${requiredRole.join(',')} roles required`))
    }
  })
}

export type RequiredRole = {
  prefix: string
  role: UserRole
}
export function registerSocketRequiredRoles(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
  logger: Debugger,
  requiredRoles: RequiredRole[],
) {
  socket.use(([ev, ...args], next) => {
    const user = (socket.request as Request<User>).user
    const userRoles = user?.roles ?? []

    const requiredRole = requiredRoles.find(r => ev.startsWith(r.prefix))
    if (requiredRole && !userRoles.includes(requiredRole.role)) {
      logger(
        '%s\t%s\t%s\t%s\t%o',
        socket.conn.transport.sid,
        user?.username,
        'Unauthorized',
        ev,
        args,
      )
      next(new Error(`Unauthorized: ${requiredRole.role} required`))
    } else {
      next()
    }
  })
}
