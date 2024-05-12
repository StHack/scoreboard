export type ConnectedUserStatistic = {
  sockets: number
}

export type ConnectedTeamStatistic = {
  users: Record<string, ConnectedUserStatistic>
  count: number
}

export type SocketStatistic = {
  game: number
  player: number
  admin: number
}

export type ServerActivityStatistics = {
  teams: Record<string, ConnectedTeamStatistic>
  admins: string[]
  teamCount: number
  userCount: number
  sockets: SocketStatistic
}

export type TimestampedServerActivityStatistics = ServerActivityStatistics & {
  timestamp: Date
}
