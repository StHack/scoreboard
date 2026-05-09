import { Message } from '@sthack/scoreboard-common'
import { Box, BoxPanel, MessageBlock } from '@sthack/scoreboard-ui/components'
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
    <BoxPanel
      title={title}
      titleProps={{
        placeSelf: 'center',
        fontSize: '3',
      }}
      // @ts-expect-error false-positive
      as="aside"
      display="flex"
      flexDirection="column"
      overflowX="hidden"
      overflowY={forceShow ? 'auto' : undefined}
      p="2"
      {...props}
    >
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
    </BoxPanel>
  )
}
