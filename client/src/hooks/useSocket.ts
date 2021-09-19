import { useState, useEffect } from 'react'
import io, { Socket } from 'socket.io-client'

export function useSocket () {
  const [socket, setSocket] = useState<Socket>()
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    const socket = io('localhost:3000')

    socket.on('connect', () => {
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      setIsConnected(false)
    })

    setSocket(socket)

    return () => {
      socket.off('connect')
      socket.off('disconnect')
    }
  }, [])

  return {
    isConnected,
    sendMessage: (message: string) => {
      socket?.emit('sendMessage', message)
    },
  }
}
