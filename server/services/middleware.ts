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
  requiredRoles: UserRole[],
  requiredMode: 'all' | 'any',
) {
  const requiredRoleSet = new Set(requiredRoles)

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

      const roles = new Intl.ListFormat('en', {
        type: requiredMode === 'all' ? 'conjunction' : 'disjunction',
      }).format(requiredRoleSet)
      next(new Error(`Unauthorized: ${roles} roles required`))
    }
  })
}

export type RequiredRole = {
  prefix: string
  roles: UserRole[]
  /**
   * By default, the all value will be applied
   */
  mode?: 'all' | 'any' | 'exact'
}
export function registerSocketRequiredRoles(
  socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, unknown>,
  logger: Debugger,
  requiredRules: RequiredRole[],
) {
  const rules = requiredRules.map(r => ({ ...r, roles: new Set(r.roles) }))

  socket.use(([ev, ...args], next) => {
    const user = (socket.request as Request<User>).user
    const userRoles = new Set(user?.roles ?? [])

    const rule = rules.find(r => ev.startsWith(r.prefix))

    if (!rule) {
      next()
      return
    }

    const isAllowed = {
      all: () => rule.roles.intersection(userRoles).size === rule.roles.size,
      any: () => rule.roles.intersection(userRoles).size > 0,
      exact: () => rule.roles.difference(userRoles).size === 0,
    }[rule.mode ?? 'all']()

    if (isAllowed) {
      next()
      return
    }

    logger(
      '%s\t%s\t%s\t%s\t%o',
      socket.conn.transport.sid,
      user?.username,
      'Unauthorized',
      ev,
      args,
    )

    const roles = new Intl.ListFormat('en', {
      type: rule.mode === 'any' ? 'disjunction' : 'conjunction',
    }).format(rule.roles)

    next(new Error(`Unauthorized: ${roles} roles required`))
  })
}
