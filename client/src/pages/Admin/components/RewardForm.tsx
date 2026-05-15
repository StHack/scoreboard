import { BaseReward, computeRewardScore } from '@sthack/scoreboard-common'
import {
  Box,
  LabelInput,
  Popup,
  SelectInput,
  SelectInputValue,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { ChangeEvent, useRef } from 'react'

export type RewardEditMode = 'password' | 'team'

export type RewardFormProps = {
  onClose: () => void
}

export function RewardForm({ onClose }: RewardFormProps) {
  const { createReward, teams } = useAdmin()
  const { gameConfig } = useGame()
  const ref = useRef<HTMLFormElement>(null)
  const { inputProp: teamProps } = useField<string>({
    defaultValue: '',
    disabled: false,
    name: 'team',
    required: true,
  })

  const { inputProp: labelProps } = useField<string>({
    defaultValue: '',
    disabled: false,
    name: 'label',
    required: true,
  })

  const { inputProp: valueProps } = useField<number>({
    defaultValue: gameConfig.baseChallScore,
    disabled: false,
    name: 'value',
    required: true,
    valueRetriever: e =>
      (e as ChangeEvent<HTMLInputElement>).currentTarget.valueAsNumber,
  })

  const demoReward: BaseReward = {
    label: labelProps.value,
    teamId: teamProps.value,
    value: valueProps.value,
  }
  const existingTeams = teams
    .map<SelectInputValue>(t => ({
      label: t.name,
      value: t._id,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))

  return (
    <Popup
      title="Create reward"
      onCancel={onClose}
      onValidate={() => ref.current?.requestSubmit()}
    >
      <Box
        as="form"
        display="flex"
        ref={ref}
        flexDirection="column"
        onSubmit={async e => {
          e.preventDefault()
          try {
            await createReward(demoReward)
            onClose()
          } catch (error) {
            alert(JSON.stringify(error))
          }
        }}
      >
        <LabelInput label="Team" required>
          <SelectInput predefinedValues={existingTeams} {...teamProps} />
        </LabelInput>

        <LabelInput label="Label" required>
          <TextInput type="text" {...labelProps} />
        </LabelInput>

        <LabelInput label="Base points value" required>
          <TextInput
            type="number"
            placeholder={gameConfig.baseChallScore.toString()}
            {...valueProps}
          />
          <Box fontStyle="italic" pt="2" pl="2" as="p">
            {`So currently it will be valued to ${computeRewardScore(demoReward, gameConfig)}pts (teams count: ${gameConfig.teamCount}, chall base score: ${gameConfig.baseChallScore})`}
          </Box>
        </LabelInput>
      </Box>
    </Popup>
  )
}
