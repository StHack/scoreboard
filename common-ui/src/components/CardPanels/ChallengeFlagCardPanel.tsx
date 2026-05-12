import {
  BaseGameConfig,
  Challenge,
  ChallengeScore,
  FlagPattern,
  TeamScore,
} from '@sthack/scoreboard-common'
import { PropsWithChildren, useState } from 'react'
import { useField } from '../../hooks'
import { Box } from '../Box'
import { BoxPanel } from '../BoxPanel'
import { Button } from '../Button'
import { IconAchievement, IconFlag } from '../Icon'
import { TextInput } from '../TextInput'

export type ChallengeFlagCardPanelProps = {
  challenge: Challenge
  score: ChallengeScore
  gameConfig: BaseGameConfig
  teamScore?: TeamScore
  readonly?: boolean
  inline?: boolean
  onFlagSubmit: (challengeId: string, flag: string) => Promise<true | string>
}

export function ChallengeFlagCardPanel({
  challenge,
  score: { achievements },
  teamScore,
  readonly = false,
  inline = false,
  onFlagSubmit,
}: ChallengeFlagCardPanelProps) {
  const { _id: challengeId, difficulty, flagPattern } = challenge
  const [error, setError] = useState<string>()
  const { inputProp } = useField<string>({
    defaultValue: '',
    name: 'flag',
    required: true,
    disabled: false,
  })

  const myTeamSolved = teamScore
    ? achievements.find(a => a.teamname === teamScore.team)
    : false

  return (
    <Container inline={inline}>
      <Box display="grid" gap="2" p="2">
        {myTeamSolved && (
          <Text
            my="2"
            role="alert"
            placeSelf="center"
            display="flex"
            alignItems="center"
            gap="2"
          >
            <IconAchievement size="2" />
            {myTeamSolved.username} has already solved this chall !
            <IconAchievement size="2" />
          </Text>
        )}

        {!myTeamSolved && !challenge.isBroken && difficulty !== 'special' && (
          <Box
            as="form"
            display="flex"
            flexDirection="column"
            onSubmit={async e => {
              e.preventDefault()
              if (readonly) return
              if (!inputProp.value) return

              const err = await onFlagSubmit(challengeId, inputProp.value)
              if (typeof err === 'string') {
                setError(err)
              }
            }}
            py="3"
            px="4"
            gap="3"
          >
            <TextInput
              placeholder={
                flagPattern !== FlagPattern.disabled
                  ? `The flag follow the format (including the pattern): ${flagPattern}`
                  : 'Propose your flag'
              }
              pattern={
                flagPattern === FlagPattern.standard
                  ? FlagPattern.standardInputPattern
                  : undefined
              }
              {...inputProp}
              disabled={readonly ? true : inputProp.disabled}
            />

            {error && (
              <Box
                backgroundColor={
                  error.startsWith('Flag is correct') ? 'green' : 'red'
                }
                color="white"
                role="alert"
              >
                {error}
              </Box>
            )}

            <Button alignSelf="center" type="submit" disabled={readonly}>
              Submit your flag
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  )
}

const Text: typeof Box = p => <Box fontSize="3" textAlign="center" {...p} />

const Container = ({
  inline,
  children,
}: PropsWithChildren<{ inline: boolean }>) =>
  inline ? (
    <>{children}</>
  ) : (
    <BoxPanel title="Flag" titleIcon={IconFlag}>
      {children}
    </BoxPanel>
  )
