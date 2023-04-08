import { Box, BoxProps } from 'components/Box'
import { Button } from 'components/Button'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'
import { FormEventHandler, PropsWithChildren, ReactNode } from 'react'

export function GeneralPanel () {
  const { gameConfig, challenges } = useGame()
  const {
    openGame,
    closeGame,
    openRegistration,
    closeRegistration,
    sendMessage,
    setTeamSize,
  } = useAdmin()

  const messageInput = useField<string>({
    defaultValue: '',
    name: 'message',
    disabled: false,
    required: true,
  })

  const messageChallengeInput = useField<string>({
    defaultValue: '',
    name: 'message-challenge',
    disabled: false,
  })

  const teamSizeInput = useField<string>({
    defaultValue: '',
    name: 'teamSize',
    disabled: false,
    required: true,
  })

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="maximalCentered"
      px="2"
      margin="0 auto"
      width="100%"
    >
      <BoxPanel
        title="Announcement"
        onSubmit={e => {
          e.preventDefault()
          messageInput.inputProp.value &&
            sendMessage(
              messageInput.inputProp.value,
              messageChallengeInput.inputProp.value,
            )
          messageInput.reset()
        }}
      >
        <TextInput
          placeholder="Broadcast a message to everyone"
          flex="1"
          {...messageInput.inputProp}
        />
        <SelectInput
          predefinedValues={challenges.map(c => c.name)}
          placeholder="or to a specific challenge"
          {...messageChallengeInput.inputProp}
        />
        <Button type="submit" flex={['100%', '0']}>
          Send
        </Button>
      </BoxPanel>

      <BoxPanel
        title="Team sizing"
        onSubmit={e => {
          e.preventDefault()
          teamSizeInput.inputProp.value &&
            setTeamSize(parseInt(teamSizeInput.inputProp.value))
          teamSizeInput.reset()
        }}
      >
        <TextInput
          placeholder={`Set a new team size limit (currently ${gameConfig.teamSize})`}
          type="number"
          flex="1"
          {...teamSizeInput.inputProp}
        />
        <Button type="submit" flex={['100%', '0']}>
          Send
        </Button>
      </BoxPanel>

      <BoxPanel title="Game state">
        <Button onClick={openGame}>Open Game</Button>
        <Button onClick={closeGame}>Close Game</Button>
      </BoxPanel>
      <BoxPanel title="Registration state">
        <Button onClick={openRegistration}>Open Registration</Button>
        <Button onClick={closeRegistration}>Close Registration</Button>
      </BoxPanel>
    </Box>
  )
}

type BoxPanelProps = BoxProps & {
  title: ReactNode
  onSubmit?: FormEventHandler<HTMLDivElement>
}
function BoxPanel ({
  title,
  children,
  onSubmit,
  ...props
}: PropsWithChildren<BoxPanelProps>) {
  return (
    <Box
      display="flex"
      flexDirection="row"
      flexWrap="wrap"
      gap="2"
      mb="3"
      as={onSubmit ? 'form' : 'div'}
      onSubmit={onSubmit}
      {...props}
    >
      <Box as="h2" fontSize="2" flex="1 1 100%" mb="2">
        {title}
      </Box>
      {children}
    </Box>
  )
}
