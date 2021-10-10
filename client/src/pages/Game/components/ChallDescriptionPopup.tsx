import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import Popup from 'components/Popup'
import { TextInput } from 'components/TextInput'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'
import {
  gridArea,
  GridAreaProps,
  space,
  SpaceProps,
  typography,
  TypographyProps,
} from 'styled-system'
import { ReactMarkdownRenderers } from 'styles/react-markdown'

export type ChallDescriptionPopupProps = {
  challenge: Challenge
  score: ChallengeScore
  onClose: () => void
}

export function ChallDescriptionPopup ({
  challenge: { name, author, category, description, difficulty },
  score: { solvedBy, score },
  onClose,
}: ChallDescriptionPopupProps) {
  const [error, setError] = useState<string>()
  const { attemptChall } = useGame()
  const { inputProp } = useField<string>({
    defaultValue: '',
    name: 'flag',
    required: true,
    disabled: false,
  })

  return (
    <Popup title={name} onClose={onClose}>
      <Grid>
        <Text gridArea="author">{author}</Text>
        <Text gridArea="category">{category}</Text>
        <Text gridArea="difficulty">{difficulty}</Text>
        <Text gridArea="score">Score: {score}</Text>
        <Box as="article" gridArea="desc" my="3">
          <ReactMarkdown
            components={ReactMarkdownRenderers}
            children={description}
          />
        </Box>

        {solvedBy && (
          <Text gridArea="flag" my="2">
            {solvedBy} has already solved this chall !
          </Text>
        )}

        {!solvedBy && (
          <Box
            as="form"
            gridArea="flag"
            display="flex"
            flexDirection="column"
            onSubmit={async e => {
              e.preventDefault()
              if (!inputProp.value) return

              await attemptChall(name, inputProp.value, (isValid, error) => {
                if (error) setError(error)
                if (isValid) onClose()
                else setError("Nope that's not the flag !")
              })
            }}
            py="3"
            px="4"
          >
            <TextInput placeholder="Propose your flag" {...inputProp} />

            {error && (
              <Box backgroundColor="red" color="white">
                {error}
              </Box>
            )}

            <Button alignSelf="center" type="submit" mt="3">
              Submit your flag
            </Button>
          </Box>
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
    'flag      flag    flag';
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
