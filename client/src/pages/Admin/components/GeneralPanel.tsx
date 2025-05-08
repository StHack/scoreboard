import styled from '@emotion/styled'
import { Box, BoxProps } from 'components/Box'
import { Button } from 'components/Button'
import { ChartActivityStats } from 'components/Charts/ChartActivityStats'
import { ChartAttemptsPanel } from 'components/Charts/ChartAttempts'
import { ConditionalLoader } from 'components/Loader'
import { SelectInput } from 'components/SelectInput'
import { TextInput } from 'components/TextInput'
import { ToggleInput } from 'components/ToggleInput'
import { useAdmin } from 'hooks/useAdmin'
import { useField } from 'hooks/useField'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { FormEventHandler, PropsWithChildren, ReactNode } from 'react'

export function GeneralPanel() {
  const {
    gameConfig: { teamSize, registrationOpened, gameOpened },
    challenges,
    isLoaded,
  } = useGame()
  const {
    attempts,
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
      display={["flex", "grid"]}
      flexDirection="column"
      maxWidth="maximalCentered"
      px="2"
      gap="3"
      margin="0 auto"
      width="100%"
      gridTemplateColumns="1fr 3fr"
      gridTemplateAreas={`
        "msg    sstats"
        "gstate sstats"
        "tsize  sstats"
        ".      sstats"
        ".      attempts"
      `}
    >
      <BoxPanel
        gridArea="msg"
        title="Announcement"
        flexDirection="row"
        flexWrap="wrap"
        onSubmitCapture={e => {
          e.preventDefault()
          if (messageInput.inputProp.value) {
            sendMessage(
              messageInput.inputProp.value,
              messageChallengeInput.inputProp.value,
            )
          }
          messageInput.reset()
        }}
      >
        <TextInput
          placeholder="Broadcast a message to everyone"
          flex="1"
          {...messageInput.inputProp}
        />
        <SelectInput
          width={['100%', 'auto']}
          predefinedValues={challenges.map(c => ({
            label: c.name,
            value: c._id,
          }))}
          placeholder="or to a specific challenge"
          {...messageChallengeInput.inputProp}
        />
        <Button type="submit" flex={['100%', '0']}>
          Send
        </Button>
      </BoxPanel>

      <BoxPanel
        gridArea="tsize"
        title={`Team sizing (currently ${teamSize})`}
        flexDirection="row"
        flexWrap="wrap"
        onSubmitCapture={e => {
          e.preventDefault()
          if (teamSizeInput.inputProp.value) {
            setTeamSize(parseInt(teamSizeInput.inputProp.value))
          }
          teamSizeInput.reset()
        }}
      >
        <ConditionalLoader
          showLoader={!isLoaded(GameContextLoadingState.config)}
        >
          <TextInput
            placeholder="Set a new team size limit"
            type="number"
            flex="1"
            {...teamSizeInput.inputProp}
          />
          <Button type="submit" flex={['100%', '0']}>
            Send
          </Button>
        </ConditionalLoader>
      </BoxPanel>

      <BoxPanel gridArea="gstate" title="Game state">
        <ConditionalLoader
          showLoader={!isLoaded(GameContextLoadingState.config)}
        >
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
        </ConditionalLoader>
      </BoxPanel>

      <ActivityStatistics />

      <BoxPanel
        gridArea="attempts"
        title={`Attempts by challs and teams (last ${attempts.length})`}
        display="grid"
        placeItems="center"
      >
        <ChartAttemptsPanel />
      </BoxPanel>
    </Box>
  )
}

type BoxPanelProps = BoxProps & {
  title: ReactNode
  onSubmitCapture?: FormEventHandler<HTMLDivElement | HTMLFormElement>
}

export function BoxPanel({
  title,
  children,
  onSubmitCapture,
  ...props
}: PropsWithChildren<BoxPanelProps>) {
  return (
    <Box
      display="grid"
      gridAutoFlow="row"
      gridTemplateRows="auto 1fr"
      gap="2"
      backgroundColor="background"
      p="3"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="medium"
      as={onSubmitCapture ? 'form' : 'div'}
      onSubmitCapture={onSubmitCapture}
      {...props}
    >
      <Box as="h2" fontSize="2" mb="2">
        {title}
      </Box>
      {children}
    </Box>
  )
}

function ActivityStatistics() {
  const { activityStatistics } = useAdmin()
  return (
    <BoxPanel
      gridArea="sstats"
      title="Server Statistics"
      display="grid"
      gridTemplateColumns="repeat(6, 1fr)"
      placeItems="center"
    >
      <Box as="h3" fontSize="2" gridColumn="span 6">
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

      {activityStatistics.admins.length > 0 && (
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

      <Box gridColumn="span 6" width="100%">
        <ChartActivityStats />
      </Box>
    </BoxPanel>
  )
}

const Ul = styled(Box)`
  padding-inline-start: ${p => p.theme.space[3]};
`
