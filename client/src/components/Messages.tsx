import { Box } from 'components/Box'
import { usePlayer } from 'hooks/usePlayer'
import { Message } from 'models/Message'
import { BorderRadiusProps, GridAreaProps, SpaceProps } from 'styled-system'
import { Button } from './Button'
import { IconValidate } from './Icon'

type MessagesProps = {
  title: string
  messages: Message[]
}

export function Messages({
  title,
  messages,
  ...props
}: MessagesProps & GridAreaProps & SpaceProps & BorderRadiusProps) {
  const { readMessages, markMessageAsRead } = usePlayer()
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

      {messages.map(m => (
        <MessageBlock
          key={m.createdAt.getTime()}
          message={m}
          hasBeenRead={readMessages.includes(m._id)}
          onReadClick={markMessageAsRead}
        />
      ))}
    </Box>
  )
}

type MessageBlockProps = {
  message: Message
  hasBeenRead: boolean
  onReadClick: (message: Message) => void
}
function MessageBlock({
  message,
  hasBeenRead,
  onReadClick,
}: MessageBlockProps) {
  const { content, createdAt, challenge } = message
  return (
    <Box
      as="p"
      p="2"
      backgroundColor={hasBeenRead ? undefined : 'primary'}
      borderColor="primaryText"
      borderRadius={hasBeenRead ? undefined : 'medium'}
      borderStyle={hasBeenRead ? undefined : 'solid'}
      borderTopStyle={hasBeenRead ? 'solid' : undefined}
      borderWidth={hasBeenRead ? 'medium' : 'thick'}
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      gap="1"
    >
      {!hasBeenRead && (
        <Button
          variant="link"
          icon={IconValidate}
          title="Mark as read"
          onClick={() => onReadClick(message)}
          size="0"
          px="0px"
          py="0px"
          gap="0px"
        />
      )}
      <span>[{createdAt.toLocaleTimeString('fr')}] </span>
      {challenge && <span>[{challenge}] </span>}
      <Box as="span" display="block" pl="3" flex="1 1 100%" minWidth="0">
        {content}
      </Box>
    </Box>
  )
}
