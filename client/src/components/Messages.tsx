import { Message } from '@sthack/scoreboard-common'
import { Box, MessageBlock } from '@sthack/scoreboard-ui/components'
import { AnimatePresence } from 'framer-motion'
import { usePlayer } from 'hooks/usePlayer'
import { BorderRadiusProps, GridAreaProps, SpaceProps } from 'styled-system'

type MessagesProps = {
  title: string
  messages: Message[]
  forceShow?: boolean
}

export function Messages({
  title,
  messages,
  forceShow = false,
  ...props
}: MessagesProps & GridAreaProps & SpaceProps & BorderRadiusProps) {
  const { readMessages, markMessageAsRead } = usePlayer()

  if (messages.length === 0 && !forceShow) {
    return undefined
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      backgroundColor="background"
      p="2"
      as="aside"
      gap="2"
      {...props}
      overflowY="auto"
    >
      <Box as="h2" fontSize="2" textAlign="center">
        {title}
      </Box>

      <AnimatePresence>
        {messages.map(m => (
          <MessageBlock
            key={m.createdAt.getTime()}
            message={m}
            hasBeenRead={readMessages.includes(m._id)}
            onReadClick={markMessageAsRead}
          />
        ))}
      </AnimatePresence>
    </Box>
  )
}
