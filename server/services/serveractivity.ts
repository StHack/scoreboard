import { ServerActivityStatistics } from '@sthack/scoreboard-common'
import { Request } from 'express'
import { Namespace, Socket } from 'socket.io'

export function registerSocketConnectivityChange(
  socket: Socket,
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
) {
  const statistics = getServerActivityStatistics(adminIo, gameIo, playerIo)
  adminIo.emit('game:activity:updated', statistics)

  socket.on('disconnect', () => {
    const statistics = getServerActivityStatistics(adminIo, gameIo, playerIo)
    adminIo.emit('game:activity:updated', statistics)
  })
}

export function getServerActivityStatistics(
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
): ServerActivityStatistics {
  const statistics: ServerActivityStatistics = {
    teams: {},
    admins: [],
    teamCount: 0,
    userCount: 0,
    sockets: {
      admin: adminIo.sockets.size,
      game: gameIo.sockets.size,
      player: playerIo.sockets.size,
    },
  }

  for (const [, soc] of playerIo.sockets) {
    const req = soc.request as Request
    if (!req.user || req.user.team === 'admin') {
      continue
    }

    const { username: u, team: t } = req.user
    const username = `u/${u}`
    const team = `t/${t}`

    let teamStat = statistics.teams[team]
    if (!teamStat) {
      teamStat = {
        count: 0,
        users: {},
      }

      statistics.teams[team] = teamStat
      statistics.teamCount++
    }

    let userStat = teamStat.users[username]
    if (!userStat) {
      userStat = {
        sockets: 0,
      }

      teamStat.users[username] = userStat
      teamStat.count++
      statistics.userCount++
    }

    userStat.sockets++
  }

  statistics.admins = [
    ...new Set<string>(
      [...adminIo.sockets.values()]
        .map(soc => (soc.request as Request).user?.username as string)
        .filter(user => !!user),
    ),
  ]
  return statistics
}
