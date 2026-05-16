import {
  Box,
  BoxPanel,
  Button,
  LabelInput,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useCreateTeamForm } from 'hooks/useCreateTeamForm'
import { GridAreaProps } from 'styled-system'

export function CreateTeamForm({ gridArea }: GridAreaProps) {
  const { formProps, nameProps, isLoading, error } = useCreateTeamForm()

  return (
    <BoxPanel
      gridArea={gridArea}
      title="Choose a team name"
      display="flex"
      flexDirection="column"
      // @ts-expect-error false positive
      as="form"
      {...formProps}
    >
      <LabelInput label="Team name">
        <TextInput
          placeholder="My awesome team name"
          flex="1"
          autoComplete="off"
          minLength={3}
          maxLength={42}
          {...nameProps}
        />
      </LabelInput>
      {error && (
        <Box backgroundColor="red" color="white" role="alert">
          {error}
        </Box>
      )}
      <Button
        type="submit"
        alignSelf={['stretch', 'center']}
        disabled={isLoading}
      >
        Create my team
      </Button>
    </BoxPanel>
  )
}
