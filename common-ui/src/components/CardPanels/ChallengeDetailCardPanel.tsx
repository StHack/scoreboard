import { useTheme } from '@emotion/react'
import {
  BaseGameConfig,
  Challenge,
  ChallengeScore,
} from '@sthack/scoreboard-common'
import { Box, BoxPanel, IconChallenge } from '@sthack/scoreboard-ui/components'
import { PropsWithChildren, useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { ReactMarkdownRenderers } from '../../styles'

type ChallengeCardPanelProps = {
  challenge: Challenge
  challScore: ChallengeScore
  gameConfig: BaseGameConfig
  disableLink?: boolean
  currentTeam?: string
  title?: string
}
export function ChallengeDetailCardPanel({
  challenge,
  challScore,
  gameConfig: { isNoCompetition },
  disableLink,
  currentTeam,
  title = 'Challenge Description',
  children,
}: PropsWithChildren<ChallengeCardPanelProps>) {
  const {
    edition: { card: ChallengeCard },
  } = useTheme()

  const renderers = useMemo<Components>(
    () =>
      disableLink
        ? {
            ...ReactMarkdownRenderers,
            a: ({ children }) => <del>{children}</del>,
          }
        : ReactMarkdownRenderers,
    [disableLink],
  )

  const { author, category, difficulty, description, isBroken } = challenge

  return (
    <BoxPanel title={title} titleIcon={IconChallenge}>
      <Box
        display="grid"
        gridTemplateColumns={['1fr 1fr 1fr', 'auto 1fr']}
        gridTemplateAreas={[
          ` "card   card     card"
            "author category difficulty"
            "score  score    score"
            "desc   desc     desc"`,
          ` "card       desc"
            "author     desc"
            "category   desc"
            "difficulty desc"
            "score      desc"
            ".          desc"`,
        ]}
        overflow="auto"
      >
        <ChallengeCard
          gridArea="card"
          placeSelf="center"
          challenge={challenge}
          score={challScore}
          onClick={() => {}}
          currentTeam={currentTeam}
        />
        <Text gridArea="author">{author}</Text>
        <Text gridArea="category">{category}</Text>
        <Text gridArea="difficulty">{difficulty}</Text>
        {!isNoCompetition && (
          <Text gridArea="score">Score: {challScore.score}</Text>
        )}

        <Box gridArea="desc">
          {!isBroken && (
            <Box as="article" my="3">
              <ReactMarkdown components={renderers} remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            </Box>
          )}

          {isBroken && (
            <Text my="2">
              This challenge is currently considered as broken and cannot be
              completed right now.
            </Text>
          )}

          {children}
        </Box>
      </Box>
    </BoxPanel>
  )
}

const Text = (p: Parameters<typeof Box>[0]) => (
  <Box fontSize="3" m="2" textAlign="center" {...p} />
)
