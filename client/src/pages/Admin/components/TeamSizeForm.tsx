import { UserRole } from '@sthack/scoreboard-common'
import { BoxPanel } from 'components/BoxPanel'
import { Button } from 'components/Button'
import { ConditionalLoader } from 'components/Loader'
import { TextInput } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { useField } from 'hooks/useField'
import { GameContextLoadingState, useGame } from 'hooks/useGame'
import { GridAreaProps } from 'styled-system'

export function TeamSizeForm({ gridArea }: GridAreaProps) {
  const {
    gameConfig: { teamSize },
    isLoaded,
  } = useGame()
  const { setTeamSize } = useAdmin()
  const { roles } = useAuth()

  const teamSizeInput = useField<string>({
    defaultValue: '',
    name: 'teamSize',
    disabled: false,
    required: true,
  })

  if (!roles.includes(UserRole.GameMaster)) {
    return null
  }

  return (
    <BoxPanel
      gridArea={gridArea}
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
      <ConditionalLoader showLoader={!isLoaded(GameContextLoadingState.config)}>
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
  )
}
