import {
  Box,
  BoxPanel,
  Button,
  LabelInput,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useJoinTeamForm } from 'hooks/useJoinTeamForm'
import { GridAreaProps } from 'styled-system'

export function JoinTeamForm({ gridArea }: GridAreaProps) {
  const { formProps, joinTokenProps, isLoading, error } = useJoinTeamForm()

  return (
    <BoxPanel
      gridArea={gridArea}
      title="Join an existing team"
      display="flex"
      flexDirection="column"
      // @ts-expect-error false positive
      as="form"
      {...formProps}
    >
      <LabelInput label="Join Token">
        <TextInput
          placeholder="The join token that your bro has share with you (it's a 8 characters format)"
          flex="1"
          autoComplete="off"
          {...joinTokenProps}
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
        Join team
      </Button>
    </BoxPanel>
  )
}
