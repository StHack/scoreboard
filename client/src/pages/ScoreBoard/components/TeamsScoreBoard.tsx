import { useTheme } from '@emotion/react'
import { ChallengeScore, TeamScore } from '@sthack/scoreboard-common'
import { Box, MotionBox } from 'components/Box'
import { ChartCategory } from 'components/Charts/ChartCategory'
import { ChartPlayerScorer } from 'components/Charts/ChartPlayerScorer'
import { IconLogo2023Icon } from 'components/Icon'
import { AnimatePresence, Variants } from 'framer-motion'
import { useMemo, useState } from 'react'

export type TeamsScoreBoardProps = {
  teamsScore: TeamScore[]
  challsScore: Record<string, ChallengeScore>
}
export function TeamsScoreBoard({
  teamsScore,
  challsScore,
}: TeamsScoreBoardProps) {
  const lastScorerIndex = teamsScore.findLastIndex(
    s => s.score > 0 && s.rank > 3,
  )
  const beforeLastScorer =
    lastScorerIndex > 0 ? teamsScore[lastScorerIndex - 1] : undefined

  return (
    <Box
      display="flex"
      flexDirection="column"
      gap="2"
      alignItems="center"
      padding="2"
    >
      {teamsScore.map(cs => (
        <ScoreCard
          key={cs.team}
          teamScore={cs}
          challsScore={challsScore}
          isLastScorer={cs === beforeLastScorer}
        />
      ))}
    </Box>
  )
}

type ScoreCardProps = {
  teamScore: TeamScore
  isLastScorer: boolean
  challsScore: Record<string, ChallengeScore>
}
export function ScoreCard({
  teamScore,
  isLastScorer,
  challsScore,
}: ScoreCardProps) {
  const theme = useTheme()
  const variants = useMemo<Variants>(
    () => ({
      unclassed: {
        background: theme.colors.background,
        width: '70%',
        fontSize: '1em',
      },
      copper: {
        background: theme.colors.copper,
        width: '80%',
        fontSize: '1.1em',
      },
      silver: {
        background: theme.colors.silver,
        width: '90%',
        fontSize: '1.2em',
      },
      gold: {
        background: theme.colors.gold,
        width: '100%',
        fontSize: '1.3em',
      },
      hover: { scale: 1.2 },
    }),
    [theme],
  )
  const [focused, setFocused] = useState<boolean>(false)

  const { rank, team, score, breakthroughs, solved, rewards } = teamScore
  const solvedNotBreakthrough = solved.filter(s => !breakthroughs.includes(s))

  return (
    <MotionBox
      layout
      variants={variants}
      initial="unclassed"
      animate={
        rank === 1 && score > 0
          ? 'gold'
          : rank === 2 && score > 0
            ? 'silver'
            : rank === 3 && score > 0
              ? 'copper'
              : 'unclassed'
      }
      whileHover="hover"
      whileFocus="hover"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      background={
        isLastScorer ? `${theme.colors.beforeLastOne} !important;` : undefined
      }
      color="primaryText"
      borderRadius="large"
      tabIndex={0}
      py="3"
      px="2"
      display="flex"
      flexDirection="column"
      gap="2"
      style={{ cursor: 'pointer' }}
    >
      <Box
        as="header"
        alignSelf="stretch"
        display="grid"
        gridTemplateColumns="repeat(4, 1fr)"
        placeItems="center"
        gap="2"
      >
        <span>{rank}</span>
        <span>{team}</span>
        <span>{score}</span>
        {!!breakthroughs.length && (
          <Box
            display="flex"
            flexWrap="wrap"
            justifyContent="center"
            gridArea={['2/1/2/5', 'auto']}
          >
            {breakthroughs.map(({ username, createdAt, challenge }, i) => (
              <Box
                key={i}
                title={`${username} - ${challenge.name} - ${createdAt.toLocaleTimeString(
                  'fr',
                )}`}
              >
                <IconLogo2023Icon size="3em" />
              </Box>
            ))}
          </Box>
        )}
      </Box>

      <AnimatePresence initial={false}>
        {focused && (
          <MotionBox
            as="section"
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto' },
              collapsed: { opacity: 0, height: 0 },
            }}
            display="flex"
            flexDirection="column"
            alignItems="center"
            gap="3"
          >
            {!!rewards.length && (
              <Box as="h3" fontSize="1.3em">
                {`${rewards.length} Rewards received`}
              </Box>
            )}

            {!!rewards.length && (
              <Box
                as="ul"
                display="flex"
                flexDirection="column"
                placeItems="center"
                gap="1"
              >
                {rewards.map(({ reward: { _id, label, createdAt }, score }) => (
                  <Box
                    key={_id}
                    as="li"
                    display="flex"
                    alignItems="center"
                    gap="2"
                  >
                    <IconLogo2023Icon size="2em" />
                    {`${label} (${score} pts) at ${createdAt.toLocaleTimeString()}`}
                    <IconLogo2023Icon size="2em" />
                  </Box>
                ))}
              </Box>
            )}

            {!!solved.length && (
              <Box as="h3" fontSize="1.3em">
                {`${solved.length} Challenges solved (${breakthroughs.length} breakthroughs)`}
              </Box>
            )}

            {!!breakthroughs.length && (
              <Box
                as="ul"
                display="flex"
                flexDirection="column"
                placeItems="center"
                gap="1"
              >
                {breakthroughs.map(
                  ({ challengeId, challenge, username, createdAt }) => (
                    <Box
                      key={challengeId}
                      as="li"
                      display="flex"
                      alignItems="center"
                      gap="2"
                    >
                      <IconLogo2023Icon size="2em" />
                      {`${username} solved "${challenge.name}" (${
                        challsScore[challengeId].score
                      } pts) at ${createdAt.toLocaleTimeString()}`}
                    </Box>
                  ),
                )}
              </Box>
            )}

            {!!solvedNotBreakthrough.length && (
              <Box
                as="ul"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap="1"
                textAlign="center"
              >
                {solvedNotBreakthrough.map(
                  ({ challengeId, challenge, username, createdAt }) => (
                    <li key={challengeId}>
                      {`${username} solved "${challenge.name}" (${
                        challsScore[challengeId].score
                      } pts) at ${createdAt.toLocaleTimeString()}`}
                    </li>
                  ),
                )}
              </Box>
            )}

            <Box
              display="grid"
              gridAutoFlow={['row', 'row', 'column']}
              gridTemplateColumns={['1fr', '1fr', '2fr 3fr']}
              px={['auto', 'auto', '2']}
              alignItems="center"
              width="100%"
            >
              <ChartCategory teamScore={teamScore} />
              <ChartPlayerScorer teamScore={teamScore} />
            </Box>
          </MotionBox>
        )}
      </AnimatePresence>
    </MotionBox>
  )
}
