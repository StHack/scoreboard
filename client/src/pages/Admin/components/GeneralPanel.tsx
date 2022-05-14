import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'
import styled from '@emotion/styled'

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
      display='flex'
      flexDirection='column'
      p='3'
      margin='0 auto'
      width='100%'
      backgroundColor='white'>
      <Block>
        <H2>Sending message</H2>
        <Box
          display='flex'
          flexDirection='row'
          my='3'
          gap='2'
          as='form'
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
            placeholder='Broadcast a message to everyone'
            flex='1'
            {...messageInput.inputProp}
          />
          <SelectInput
            predefinedValues={challenges.map(c => c.name)}
            placeholder='or to a specific challenge'
            {...messageChallengeInput.inputProp}
          />
          <Button type='submit'>Send</Button>
        </Box>
      </Block>
      <Block>
        <H2>Game settings</H2>
        <Box
          display='flex'
          flexDirection='row'
          my='3'
          gap='2'
          as='form'
          onSubmit={e => {
            e.preventDefault()
            teamSizeInput.inputProp.value &&
            setTeamSize(parseInt(teamSizeInput.inputProp.value))
            teamSizeInput.reset()
          }}
        >
          <TextInput
            placeholder={`Set a new team size limit (currently ${gameConfig.teamSize})`}
            type='number'
            flex='1'
            {...teamSizeInput.inputProp}
          />
          <Button type='submit'>Send</Button>
        </Box>
      </Block>
      <Block>
        <H2>Game control</H2>
        <Box display='flex' my='3' flexDirection='column' gap='3'>
          <Box>
            <H3>Open/Close game</H3>
            <Box display='flex' flexDirection='row' gap='2'>
              <Button onClick={openGame}>Open Game</Button>
              <Button onClick={closeGame}>Close Game</Button>
            </Box>
          </Box>
          <Box>
            <H3>Open/Close registration</H3>
            <Box display='flex' flexDirection='row' gap='2'>
              <Button onClick={openRegistration}>Open Registration</Button>
              <Button onClick={closeRegistration}>Close Registration</Button>
            </Box>
          </Box>
        </Box>
      </Block>
    </Box>
  )
}

const H2 = styled.h2`
  color: ${p => p.theme.colors.pink};
  font-size: ${p => p.theme.fontSizes.subtitle};
`

const H3 = styled.h3`
  color: ${p => p.theme.colors.greys[2]};
  font-size: ${p => p.theme.fontSizes[3]};
  margin-bottom: ${p => p.theme.space[2]};
`

const Block = styled(Box)`
  margin-bottom: ${p => p.theme.space[4]};
`
