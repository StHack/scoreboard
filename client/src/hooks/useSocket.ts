import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { useAuth } from './useAuthentication'

export function useSocket(namespace: string) {
  const [socket, setSocket] = useState<Socket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const { logOut } = useAuth()

  useEffect(() => {
    const socket = io(namespace, {
      transports: ['websocket'],
      path: '/api/socket',
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', async () => {
      setIsConnected(false)
      await logOut()
    })

    socket.on('connect_error', async () => {
      await logOut()
    })

    setSocket(socket)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.disconnect()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [namespace])

  return {
    isConnected,
    socket,
  }
}
