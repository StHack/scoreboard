/* eslint-disable no-restricted-globals */
import styled from '@emotion/styled'
import { Box, BoxProps } from 'components/Box'
import { Button } from 'components/Button'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { ToggleInput } from 'components/ToggleInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'
import { FormEventHandler, PropsWithChildren, ReactNode } from 'react'

export function GeneralPanel () {
  const {
    gameConfig: { teamSize, registrationOpened, gameOpened },
    challenges,
  } = useGame()
  const {
    activityStatistics,
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
      gap="3"
      margin="0 auto"
      width="100%"
    >
      <BoxPanel
        title="Announcement"
        flexDirection="row"
        flexWrap="wrap"
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
        flexDirection="row"
        flexWrap="wrap"
        onSubmit={e => {
          e.preventDefault()
          teamSizeInput.inputProp.value &&
            setTeamSize(parseInt(teamSizeInput.inputProp.value))
          teamSizeInput.reset()
        }}
      >
        <TextInput
          placeholder={`Set a new team size limit (currently ${teamSize})`}
          type="number"
          flex="1"
          {...teamSizeInput.inputProp}
        />
        <Button type="submit" flex={['100%', '0']}>
          Send
        </Button>
      </BoxPanel>

      <BoxPanel title="Game state">
        <ToggleInput
          checked={gameOpened}
          onChange={value =>
            value
              ? openGame()
              : confirm('Are you sure to stop the game?') && closeGame()
          }
        >
          Game Status
        </ToggleInput>
        <ToggleInput
          checked={registrationOpened}
          onChange={value =>
            value
              ? openRegistration()
              : confirm('Are you sure to stop the registration?') &&
                closeRegistration()
          }
        >
          Registration Status
        </ToggleInput>
      </BoxPanel>

      <BoxPanel
        title="Server Statistics"
        display="grid"
        gridTemplateColumns="repeat(6, 1fr)"
        placeItems="center"
      >
        <Box as="h3" fontSize="2" textAlign="center" gridColumn="span 6">
          Socket Statistics
        </Box>

        <Box as="span" gridColumn="span 2">
          Game socket: {activityStatistics.sockets.game}
        </Box>
        <Box as="span" gridColumn="span 2">
          Player socket: {activityStatistics.sockets.player}
        </Box>
        <Box as="span" gridColumn="span 2">
          Admin socket: {activityStatistics.sockets.admin}
        </Box>

        <Box as="h3" fontSize="2" mt="2" gridColumn="span 6">
          Game Statistics
        </Box>

        <Box as="span" gridColumn="span 3">
          Teams connected: {activityStatistics.teamCount}
        </Box>
        <Box as="span" gridColumn="span 3">
          Users connected: {activityStatistics.userCount}
        </Box>

        <Ul
          as="ul"
          gridColumn="span 6"
          placeSelf="stretch"
          display="grid"
          gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
          alignItems="start"
          gap="2"
        >
          {Object.entries(activityStatistics.teams).map(([team, stats]) => (
            <li key={team}>
              {team} ({stats.count} players)
              <Ul as="ul">
                {Object.entries(stats.users).map(([user, s]) => (
                  <li key={user}>
                    {user} ({s.sockets} sockets)
                  </li>
                ))}
              </Ul>
            </li>
          ))}
        </Ul>

        {activityStatistics.admins.length === 0 && (
          <>
            <Box as="h3" fontSize="2" mt="2" gridColumn="span 6">
              Admins connected
            </Box>
            <Ul
              as="ul"
              gridColumn="span 6"
              placeSelf="stretch"
              display="grid"
              gridTemplateColumns={['1fr', '1fr 1fr', '1fr 1fr 1fr']}
              alignItems="start"
              gap="2"
            >
              {activityStatistics.admins.map(admin => (
                <li key={admin}>{admin}</li>
              ))}
            </Ul>
          </>
        )}
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
      flexDirection="column"
      gap="2"
      backgroundColor="background"
      p="3"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="medium"
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

const Ul = styled(Box)`
  padding-inline-start: ${p => p.theme.space[3]};
`
