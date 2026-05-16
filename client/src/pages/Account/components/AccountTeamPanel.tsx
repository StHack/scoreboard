import { UserRole } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  Button,
  ConditionalLoader,
  IconTeams,
} from '@sthack/scoreboard-ui/components'
import { useAuth } from 'hooks/useAuthentication'
import { PlayerContextLoadingState, usePlayer } from 'hooks/usePlayer'
import { useState } from 'react'
import { CreateTeamForm } from './CreateTeamForm'
import { JoinTeamForm } from './JoinTeamForm'
import { MyTeamDetailPanel } from './MyTeamDetailPanel'

export function AccountTeamPanel() {
  const { user } = useAuth()
  const { myTeam, isLoaded, myTeamScore } = usePlayer()
  const [mode, setMode] = useState<'creation' | 'join'>()

  if (user && user.roles.includes(UserRole.Admin)) {
    return (
      <BoxPanel
        title="You are an admin so you are not allowed to create/join a team"
        titleIcon={IconTeams}
      />
    )
  }

  return (
    <ConditionalLoader
      size="8"
      showLoader={!isLoaded(PlayerContextLoadingState.team)}
    >
      {myTeam && (
        <MyTeamDetailPanel myTeam={myTeam} myTeamScore={myTeamScore} />
      )}
      {!myTeam && (
        <BoxPanel title="Do you wanna play the CTF?" titleIcon={IconTeams}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap="2"
          >
            <Button
              type="button"
              variant="primary"
              onClick={() => setMode('creation')}
            >
              Create a team
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setMode('join')}
            >
              Join a team
            </Button>
          </Box>
          {mode === 'creation' && <CreateTeamForm />}
          {mode === 'join' && <JoinTeamForm />}
        </BoxPanel>
      )}
    </ConditionalLoader>
  )
}
