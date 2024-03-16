import { Namespace } from 'socket.io'

export function emitEventLog(
  gameIo: Namespace,
  type: string,
  { message, ...options }: { message?: string } & Record<string, unknown>,
) {
  gameIo.emit('events:happen', { type, message, options })
}
