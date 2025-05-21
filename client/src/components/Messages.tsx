import { useTheme } from '@emotion/react'
import { Message } from '@sthack/scoreboard-common'
import { Box, MotionBox } from 'components/Box'
import { AnimatePresence } from 'framer-motion'
import { usePlayer } from 'hooks/usePlayer'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { BorderRadiusProps, GridAreaProps, SpaceProps } from 'styled-system'
import { ReactMarkdownRenderers } from 'styles/react-markdown'
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
  const { colors, radii, borderWidths } = useTheme()
  return (
    <MotionBox
      as="p"
      p="2"
      initial={{ opacity: 0, x: 40 }}
      animate={{
        opacity: 1,
        x: 0,
        backgroundColor: hasBeenRead ? 'transparent' : colors.primary,
        borderRadius: hasBeenRead ? '0px' : radii.medium,
        borderStyle: hasBeenRead ? 'none' : 'solid',
        borderTopStyle: hasBeenRead ? 'solid' : 'solid',
        borderWidth: hasBeenRead ? borderWidths.medium : borderWidths.thick,
      }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      display="flex"
      flexWrap="wrap"
      alignItems="center"
      gap="1"
      borderColor="primaryText"
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
        <ReactMarkdown
          components={ReactMarkdownRenderers}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </Box>
    </MotionBox>
  )
}
