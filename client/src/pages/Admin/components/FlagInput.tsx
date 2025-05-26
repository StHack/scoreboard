import { Challenge, FlagPattern } from '@sthack/scoreboard-common'
import {
  Box,
  Button,
  IconFlagEdit,
  IconRepair,
  LabelInput,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useFieldReturn } from '@sthack/scoreboard-ui/hooks'
import { ChangeEvent } from 'react'
import { AlignSelfProps, GridAreaProps } from 'styled-system'

type FlagInputProps = {
  flagsProps: useFieldReturn<Challenge['flag']>['inputProp']
  flagPatternProps: useFieldReturn<Challenge['flagPattern']>['inputProp']
}

export function FlagInput({
  flagsProps,
  flagPatternProps,
  ...props
}: FlagInputProps & GridAreaProps & AlignSelfProps) {
  const { value: flagPattern } = flagPatternProps

  const onFlagPatternChange = (str: string) => () =>
    flagPatternProps.onChange({
      target: {
        value: str,
      },
    } as ChangeEvent<HTMLInputElement>)

  return (
    <Box display="flex" flexDirection="column" width="100%" gap="2" {...props}>
      <LabelInput label="Flag" required>
        <TextInput
          type="text"
          {...flagsProps}
          required
          minLength={1}
          placeholder={
            flagPattern !== FlagPattern.disabled
              ? `The flag should follow the format: ${flagPattern}`
              : 'Is better to specify the flag format in order to avoid confusion for players'
          }
          pattern={
            flagPattern === FlagPattern.standard
              ? FlagPattern.standardInputPattern
              : undefined
          }
        />
      </LabelInput>

      {flagPattern === FlagPattern.standard && (
        <Button
          flex="1"
          type="button"
          icon={IconFlagEdit}
          onClick={onFlagPatternChange(FlagPattern.disabled)}
        >
          {'Customize flag pattern'}
        </Button>
      )}

      {flagPattern !== FlagPattern.standard && (
        <LabelInput label="Flag pattern" gridArea="flag">
          <Box
            display="grid"
            gridTemplateColumns="1fr auto"
            flex="1"
            minWidth="0"
            gap="2"
          >
            <TextInput
              type="text"
              {...flagPatternProps}
              minLength={0}
              placeholder="Specify here the format expected for your flag, everything that you put here should be specified by the player: STHACK{XXXXXXXXXXX}"
            />
            <Button
              key="reset"
              type="button"
              icon={IconRepair}
              onClick={onFlagPatternChange(FlagPattern.standard)}
            >
              {'Reset to default flag pattern'}
            </Button>
          </Box>
        </LabelInput>
      )}
    </Box>
  )
}
