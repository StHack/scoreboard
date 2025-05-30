import { UserRole } from '@sthack/scoreboard-common'
import {
  BoxPanel,
  ConditionalLoader,
  ToggleInput,
} from '@sthack/scoreboard-ui/components'
import { useAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { GameContextLoadingState, useGame } from 'hooks/useGame'

export function GameStateForm({ gridArea }: { gridArea: string }) {
  const {
    gameConfig: { registrationOpened, gameOpened },
    isLoaded,
  } = useGame()
  const { openGame, closeGame, openRegistration, closeRegistration } =
    useAdmin()

  const { roles } = useAuth()

  if (!roles.includes(UserRole.GameMaster)) {
    return null
  }

  return (
    <BoxPanel gridArea={gridArea} title="Game state">
      <ConditionalLoader showLoader={!isLoaded(GameContextLoadingState.config)}>
        <ToggleInput
          checked={gameOpened}
          onChange={value =>
            value
              ? confirm('Are you sure to open the game?') && openGame()
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
  )
}
