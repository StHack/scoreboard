import styled from '@emotion/styled'
import { Challenge, ChallengeScore, Message } from '@sthack/scoreboard-common'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import Popup from 'components/Popup'
import { TextInput } from 'components/TextInput'
import { useField } from 'hooks/useField'
import { usePlayer } from 'hooks/usePlayer'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import {
  gridArea,
  GridAreaProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'
import { ReactMarkdownRenderers } from 'styles/react-markdown'
import { Messages } from './Messages'

export type ChallDescriptionPopupProps = {
  challenge: Challenge
  messages: Message[]
  readonly?: boolean
  score: ChallengeScore
  onClose: () => void
}

export function ChallDescriptionPopup({
  challenge,
  score: { score, achievements },
  messages,
  readonly = false,
  onClose,
}: ChallDescriptionPopupProps) {
  const {
    _id: challengeId,
    name,
    author,
    category,
    description,
    difficulty,
  } = challenge
  const [error, setError] = useState<string>()
  const { attemptChall, myTeamName } = usePlayer()
  const { inputProp } = useField<string>({
    defaultValue: '',
    name: 'flag',
    required: true,
    disabled: false,
  })

  const myTeamSolved = achievements.find(a => a.teamname === myTeamName)

  const latestAchievement = achievements[achievements.length - 1]

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
          <Text gridArea="desc" my="2">
            This challenge is currently considered as broken and cannot be
            completed right now.
          </Text>
        )}

        {myTeamSolved && (
          <Text gridArea="flag" my="2">
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
          >
            <TextInput
              placeholder="Propose your flag"
              {...inputProp}
              disabled={readonly ? true : inputProp.disabled}
            />

            {error && (
              <Box backgroundColor="red" color="white">
                {error}
              </Box>
            )}

            <Button alignSelf="center" type="submit" mt="3" disabled={readonly}>
              Submit your flag
            </Button>
          </Box>
        )}

        {!!messages.length && (
          <Messages title="Clues" messages={messages} gridArea="msg" my="3" />
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
const Text = styled.p<SpaceProps & GridAreaProps & TypographyProps>`
  text-align: center;
  ${space}
  ${gridArea}
  ${typography}
`
Text.defaultProps = {
  fontSize: '3',
  m: '2',
}
