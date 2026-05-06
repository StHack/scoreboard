import {
  BaseGameConfig,
  Challenge,
  ChallengeScore,
  FlagPattern,
  TeamScore,
} from '@sthack/scoreboard-common'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useField } from '../hooks'
import { ReactMarkdownRenderers } from '../styles'
import { Box } from './Box'
import { Button } from './Button'
import { TextInput } from './TextInput'

export type ChallDescriptionDetailProps = {
  challenge: Challenge
  score: ChallengeScore
  gameConfig: BaseGameConfig
  teamScore?: TeamScore
  readonly?: boolean
  onFlagSubmit: (challengeId: string, flag: string) => Promise<true | string>
}

export function ChallDescriptionDetail({
  challenge,
  score: { score, achievements },
  teamScore,
  gameConfig: { isNoCompetition },
  readonly = false,
  onFlagSubmit,
}: ChallDescriptionDetailProps) {
  const {
    _id: challengeId,
    author,
    category,
    description,
    difficulty,
    flagPattern,
  } = challenge
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
    <Box
      display="grid"
      gridTemplateColumns="repeat(3, 1fr)"
      gridTemplateAreas={`
        'name      name    name'
        'category  author  difficulty'
        'score     score   score'
        'desc      desc    desc'
        'state     state   state'
        'flag      flag    flag'
      `}
      gap="2"
      p="2"
    >
      <Text gridArea="author">{author}</Text>
      <Text gridArea="category">{category}</Text>
      <Text gridArea="difficulty">{difficulty}</Text>
      {!isNoCompetition && <Text gridArea="score">Score: {score}</Text>}

      {!challenge.isBroken && (
        <Box as="article" gridArea="desc" my="3">
          <ReactMarkdown
            components={ReactMarkdownRenderers}
            remarkPlugins={[remarkGfm]}
          >
            {description}
          </ReactMarkdown>
        </Box>
      )}

      {challenge.isBroken && (
        <Text gridArea="desc" my="2" role="alert">
          This challenge is currently considered as broken and cannot be
          completed right now.
        </Text>
      )}

      {myTeamSolved && (
        <Text gridArea="flag" my="2" role="alert">
          {myTeamSolved.username} has already solved this chall !
        </Text>
      )}

      {!myTeamSolved && !challenge.isBroken && difficulty !== 'special' && (
        <Box
          as="form"
          gridArea="flag"
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
  )
}

const Text: typeof Box = p => <Box fontSize="3" textAlign="center" {...p} />
