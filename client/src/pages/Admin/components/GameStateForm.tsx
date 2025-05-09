import { BoxPanel } from 'components/BoxPanel'
import { ConditionalLoader } from 'components/Loader'
import { ToggleInput } from 'components/ToggleInput'
import { useAdmin } from 'hooks/useAdmin'
import { GameContextLoadingState, useGame } from 'hooks/useGame'

export function GameStateForm({ gridArea }: { gridArea: string }) {
  const {
    gameConfig: { registrationOpened, gameOpened },
    isLoaded,
  } = useGame()
  const { openGame, closeGame, openRegistration, closeRegistration } =
    useAdmin()

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
