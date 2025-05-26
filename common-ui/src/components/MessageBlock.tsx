import { useTheme } from '@emotion/react'
import { Message } from '@sthack/scoreboard-common'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ReactMarkdownRenderers } from '../styles'
import { Box, MotionBox } from './Box'
import { Button } from './Button'
import { IconValidate } from './Icon'

type MessageBlockProps = {
  message: Message
  hasBeenRead: boolean
  onReadClick: (message: Message) => void
}
export function MessageBlock({
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
