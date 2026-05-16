import { isPlayer, UserRole } from '@sthack/scoreboard-common'
import { Box, Loader } from '@sthack/scoreboard-ui/components'
import { Messages } from 'components/Messages'
import { useAuth } from 'hooks/useAuthentication'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { ProvidePlayer } from 'hooks/usePlayer'
import { PropsWithChildren } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { UserScore } from './components/UserScore'

export function GameLayout() {
  const { isAuthenticated, hasReadRules, user } = useAuth()
  const {
    gameConfig: { gameOpened },
    isLoaded,
  } = useGame()

  if (
    !isLoaded(GameContextLoadingState.config) ||
    !isLoaded(GameContextLoadingState.challenges)
  ) {
    return <Loader size="10" placeSelf="center" />
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasReadRules) {
    return <Navigate to="/rules" replace />
  }

  if (!user.roles.includes(UserRole.Admin)) {
    if (!isPlayer(user) || !gameOpened) {
      return <Navigate to="/account/team" replace />
    }
  }

  return (
    <ProvidePlayer>
      <Game>
        <Outlet />
      </Game>
    </ProvidePlayer>
  )
}

export function Game({ children }: PropsWithChildren) {
  const { messages } = useGame()

  return (
    <Box
      display={['flex', 'grid']}
      gridTemplateAreas={[
        null,
        `
        'score   score message'
        'control control message'
        'chall   chall message'
        `,
        `
        'control score message'
        'chall   chall message'
        `,
      ]}
      gridTemplateRows={[null, 'auto auto 1fr', 'auto 1fr']}
      gridTemplateColumns="2fr 2fr minmax(25rem, 1fr)"
      flexDirection="column"
      p="2"
      rowGap="3"
      columnGap="4"
      overflowY={[null, 'hidden']}
    >
      <UserScore />

      {children}

      <Messages
        title="Message from Staff"
        messages={messages}
        gridArea="message"
        borderRadius="medium"
        // @ts-expect-error false positive
        as="aside"
        overflowX="hidden"
        overflowY="auto"
      />
    </Box>
  )
}
