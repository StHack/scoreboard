import { useEffect, useState } from 'react'
import io, { Socket } from 'socket.io-client'
import { useAuth } from './useAuthentication'

export function useSocket (namespace: string) {
  const [socket, setSocket] = useState<Socket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const { logOut } = useAuth()

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SERVER_HOST + namespace, {
      transports: ['websocket'],
      path: '/api/socket',
    })

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    socket.on('connect_error', () => {
      logOut()
    })

    setSocket(socket)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    isConnected,
    socket,
  }
}
