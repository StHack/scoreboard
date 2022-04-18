import { Box } from 'components/Box'
import { Message } from 'models/Message'

type MessagesProps = {
  messages: Message[]
}

export function Messages ({ messages }: MessagesProps) {
  return (
    <>
      {messages.map(m => (
        <Box key={m.createdAt.getTime()} as="p" mt="2" mb="2">
          <hr />
          <span>[{m.createdAt.toLocaleTimeString('fr')}] </span>
          {m.challenge && <span>[{m.challenge}] </span>}
          <Box as="span" display="block" pl="2" pt="2">
            {m.content}
          </Box>
        </Box>
      ))}
    </>
  )
}
