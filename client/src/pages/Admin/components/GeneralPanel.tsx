import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'

export function GeneralPanel () {
  const {
    openGame,
    closeGame,
    openRegistration,
    closeRegistration,
    sendMessage,
  } = useAdmin()
  const { inputProp, reset } = useField<string>({
    defaultValue: '',
    name: 'message',
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
          inputProp.value && sendMessage(inputProp.value)
          reset()
        }}
      >
        <TextInput
          placeholder="Broadcast a message to everyone"
          flex="1"
          {...inputProp}
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
