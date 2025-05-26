import styled from '@emotion/styled'
import {
  Challenge,
  ChallengeScore,
  FlagPattern,
} from '@sthack/scoreboard-common'
import { PropsWithChildren, ReactNode, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  gridArea,
  GridAreaProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  typography,
  TypographyProps,
} from 'styled-system'
import { useField } from '../hooks'
import { cleanStyledSystem, ReactMarkdownRenderers } from '../styles'
import { Box } from './Box'
import { Button } from './Button'
import { Popup } from './Popup'
import { TextInput } from './TextInput'

export type ChallDescriptionPopupProps = {
  challenge: Challenge
  messageBlock?: ReactNode
  readonly?: boolean
  score: ChallengeScore
  myTeamName: string
  attemptChall: (challengeId: string, flag: string) => Promise<true | string>
  onClose: () => void
}

export function ChallDescriptionPopup({
  challenge,
  score: { score, achievements },
  messageBlock,
  readonly = false,
  myTeamName,
  attemptChall,
  onClose,
}: ChallDescriptionPopupProps) {
  const {
    _id: challengeId,
    name,
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

  const myTeamSolved = achievements.find(a => a.teamname === myTeamName)

  return (
    <Popup title={name} onClose={onClose}>
      <Grid>
        <Text gridArea="author">{author}</Text>
        <Text gridArea="category">{category}</Text>
        <Text gridArea="difficulty">{difficulty}</Text>
        <Text gridArea="score">Score: {score}</Text>

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

              const err = await attemptChall(challengeId, inputProp.value)
              if (err === true) {
                onClose()
              } else {
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

        {messageBlock && (
          <MessageBlock gridArea="msg" my="3">
            {messageBlock}
          </MessageBlock>
        )}
      </Grid>
    </Popup>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-areas:
    'category  author  difficulty'
    'score     score   score'
    'desc      desc    desc'
    'state     state   state'
    'flag      flag    flag'
    'msg       msg     msg';
`

const MessageBlock = styled(Box)`
  &:empty {
    display: none;
  }
`

type TextProps = TextAlignProps & SpaceProps & GridAreaProps & TypographyProps

const T = styled('p', cleanStyledSystem)<TextProps>(
  textAlign,
  space,
  gridArea,
  typography,
)

const Text = ({
  fontSize = '3',
  m = '2',
  textAlign = 'center',
  ...p
}: PropsWithChildren<TextProps & { role?: string }>) => (
  <T fontSize={fontSize} m={m} textAlign={textAlign} {...p} />
)
