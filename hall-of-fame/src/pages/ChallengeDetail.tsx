import { Achievement } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  BoxProps,
  ChallengeCard,
  ChartAchievementsOverTime,
  ChartAttemptsOverTime,
  ColumnDefinition,
  IconAchievement,
  IconAttempt,
  IconChallenge,
  IconUsers,
  Table,
} from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { PageLoader } from 'components/PageLoader'
import { useChallengeData } from 'hooks/useChallengeData'
import { PropsWithChildren } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import { useParams } from 'react-router-dom'
import remarkGfm from 'remark-gfm'

export function ChallengeDetail() {
  const { challengeId } = useParams()
  const { attempts, challScore, loading, error, minDate, maxDate } =
    useChallengeData(challengeId)

  const { challenge } = challScore
  const { author, category, difficulty, name, description, isBroken } =
    challenge

  return (
    <PageLoader
      title={`Challenge ${name}`}
      icon={IconChallenge}
      showLoader={loading}
      error={error}
    >
      <BoxPanel title="Challenge Description" titleIcon={IconChallenge}>
        <Box
          display="grid"
          gridTemplateColumns="auto 1fr"
          gridTemplateAreas={`
           "card       desc"
           "author     desc"
           "category   desc"
           "difficulty desc"
           "score      desc"
           ".          desc"
          `}
          overflow="auto"
        >
          <ChallengeCard
            gridArea="card"
            challenge={challenge}
            score={challScore}
            onClick={() => {}}
          />
          <Text gridArea="author">{author}</Text>
          <Text gridArea="category">{category}</Text>
          <Text gridArea="difficulty">{difficulty}</Text>
          <Text gridArea="score">Score: {challScore.score}</Text>

          {!isBroken && (
            <Box as="article" gridArea="desc" my="3">
              <ReactMarkdown components={Renderers} remarkPlugins={[remarkGfm]}>
                {description}
              </ReactMarkdown>
            </Box>
          )}

          {isBroken && (
            <Text gridArea="desc" my="2">
              This challenge is currently considered as broken and cannot be
              completed right now.
            </Text>
          )}
        </Box>
      </BoxPanel>

      <BoxPanel title="Challenge solvers" titleIcon={IconUsers}>
        {challScore.achievements.length > 0 && (
          <Table
            data={challScore.achievements}
            columns={columns}
            rowKey={row => row.teamname + row.username}
          />
        )}
        {challScore.achievements.length === 0 && (
          <Box as="p" fontSize="1" p="3">
            Nobody has managed to solved that challenge
          </Box>
        )}
      </BoxPanel>

      {challScore.achievements.length > 0 && (
        <BoxPanel title="Achievements Over time" titleIcon={IconAchievement}>
          <ChartAchievementsOverTime
            achievements={challScore.achievements}
            defaultGroup="team"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}

      {attempts.length > 0 && (
        <BoxPanel title="Failed Attempts Over time" titleIcon={IconAttempt}>
          <ChartAttemptsOverTime
            attempts={attempts}
            defaultGroup="team"
            minDate={minDate}
            maxDate={maxDate}
          />
        </BoxPanel>
      )}
    </PageLoader>
  )
}

const columns: ColumnDefinition<Achievement>[] = [
  { header: 'Time', rowValue: row => row.createdAt.toLocaleTimeString() },
  { header: 'Player', rowValue: row => row.username },
  { header: 'Team', rowValue: row => row.teamname },
]

const Text = ({
  fontSize = '3',
  m = '2',
  textAlign = 'center',
  ...p
}: PropsWithChildren<BoxProps>) => (
  <Box fontSize={fontSize} m={m} textAlign={textAlign} {...p} />
)

const Renderers: Components = {
  ...ReactMarkdownRenderers,
  a: ({ children }) => <del>{children}</del>,
}
