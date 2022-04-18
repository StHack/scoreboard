import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'

export function GeneralPanel () {
  const { challenges } = useGame()
  const {
    openGame,
    closeGame,
    openRegistration,
    closeRegistration,
    sendMessage,
    setTeamSize,
  } = useAdmin()

  const { gameConfig } = useGame()
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
      <Box
        display="flex"
        flexDirection="row"
        my="3"
        gap="2"
        as="form"
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
        <Button type="submit">Send</Button>
      </Box>

      <Box
        display="flex"
        flexDirection="row"
        my="3"
        gap="2"
        as="form"
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
        <Button type="submit">Send</Button>
      </Box>

      <Box display="flex" flexDirection="row" gap="2">
        <Button onClick={openGame}>Open Game</Button>
        <Button onClick={closeGame}>Close Game</Button>
        <Button onClick={openRegistration}>Open Registration</Button>
        <Button onClick={closeRegistration}>Close Registration</Button>
      </Box>
    </Box>
  )
}
