import { Message } from '@sthack/scoreboard-common'
import { BoxPanel, MessageBlock } from '@sthack/scoreboard-ui/components'
import { AnimatePresence } from 'framer-motion'
import { usePlayer } from 'hooks/usePlayer'

type MessagesProps = {
  title: string
  messages: Message[]
}

export function Messages({
  title,
  messages,
  ...props
}: MessagesProps & Parameters<typeof BoxPanel>[0]) {
  const { readMessages, markMessageAsRead } = usePlayer()

  return (
    <BoxPanel
      title={title}
      titleProps={{
        placeSelf: 'center',
        fontSize: '3',
      }}
      display="flex"
      flexDirection="column"
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
