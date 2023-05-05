import { Request } from 'express'
import { ServerActivityStatistics } from 'models/ServerActivityStatistics'
import { Namespace, Socket } from 'socket.io'

export function registerSocketConnectivityChange(
  socket: Socket,
  adminIo: Namespace,
  gameIo: Namespace,
  playerIo: Namespace,
) {
  const statistics = getServerActivityStatistics(adminIo, gameIo, playerIo)
  adminIo.emit('game:activity:updated', statistics)

  socket.on('disconnect', async () => {
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

  for (const [id, soc] of playerIo.sockets) {
    const req = soc.request as Request
    if (!req.user || req.user.team === 'admin') {
      continue
    }

    const { username, team } = req.user

    if (!statistics.teams[team]) {
      statistics.teams[team] = {
        count: 0,
        users: {},
      }

      statistics.teamCount++
    }

    if (!statistics.teams[team].users[username]) {
      statistics.teams[team].users[username] = {
        sockets: 0,
      }

      statistics.teams[team].count++
      statistics.userCount++
    }

    statistics.teams[team].users[username].sockets++
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
