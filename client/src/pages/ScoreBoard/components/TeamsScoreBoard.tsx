import { css, useTheme } from '@emotion/react'
import styled from '@emotion/styled'
import { Box, BoxProps, StyledBoxComposed } from 'components/Box'
import { IconLogo2023Icon } from 'components/Icon'
import {
  AnimatePresence,
  DragControls,
  MotionValue,
  Reorder,
  Variants,
  motion,
  useDragControls,
  useMotionValue,
} from 'framer-motion'
import { ChallengeScore, TeamScore } from 'models/GameScore'
import { useMemo, useState } from 'react'
import { cleanStyledSystemOnly } from 'styles'

export type TeamsScoreBoardProps = {
  teamsScore: TeamScore[]
  challsScore: Record<string, ChallengeScore>
}
export function TeamsScoreBoard ({
  teamsScore,
  challsScore,
}: TeamsScoreBoardProps) {
  const y = useMotionValue(0)
  const dragControls = useDragControls()
  // @ts-ignore
  const lastScorer = teamsScore.findLast(s => s.score > 0)

  return (
    <StyledReorderGroup
      axis="y"
      values={teamsScore}
      onReorder={() => {}}
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
          isLastScorer={cs === lastScorer}
          dragControls={dragControls}
          y={y}
        />
      ))}
    </StyledReorderGroup>
  )
}

type ScoreCardProps = {
  teamScore: TeamScore
  isLastScorer: boolean
  challsScore: Record<string, ChallengeScore>
  dragControls: DragControls
  y: MotionValue<number>
}
export function ScoreCard ({
  teamScore,
  isLastScorer,
  challsScore,
  dragControls,
  y,
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
        background: '#A77044DD',
        width: '80%',
        fontSize: '1.1em',
      },
      silver: {
        background: '#A7A7ADDD',
        width: '90%',
        fontSize: '1.2em',
      },
      gold: {
        background: '#FEE101DD',
        width: '100%',
        fontSize: '1.3em',
      },
      hover: { scale: 1.2 },
    }),
    [theme],
  )
  const [focused, setFocused] = useState<boolean>(false)

  const { rank, team, score, breakthroughs, solved } = teamScore
  const solvedNotBreakthrough = solved.filter(s => !breakthroughs.includes(s))

  return (
    <Item
      value={score}
      style={{ y }}
      drag={false}
      dragListener={false}
      dragControls={dragControls}
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
        isLastScorer
          ? 'linear-gradient(124deg,#ff240099,#e81d1d99,#e8b71d,#e3e81d99,#1de84099,#1ddde899,#2b1de899,#dd00f399,#dd00f399) !important;'
          : undefined
      }
      color="primaryText"
      borderRadius="large"
      tabIndex={0}
      py="3"
      px="2"
      display="flex"
      flexDirection="column"
      gap="2"
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
                title={`${username} - ${challenge} - ${createdAt.toLocaleTimeString(
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
          <Section
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
                gridArea="btd"
                gap="1"
              >
                {breakthroughs.map(({ challenge, username, createdAt }) => (
                  <Box
                    key={challenge}
                    as="li"
                    display="flex"
                    alignItems="center"
                    gap="2"
                  >
                    <IconLogo2023Icon size="2em" />
                    {`${username} solved "${challenge}" (${
                      challsScore[challenge].score
                    } pts) at ${createdAt.toLocaleTimeString()}`}
                  </Box>
                ))}
              </Box>
            )}

            {!!solvedNotBreakthrough.length && (
              <Box
                as="ul"
                display="flex"
                flexDirection="column"
                alignItems="center"
                gridArea="btd"
                gap="1"
                textAlign="center"
              >
                {solvedNotBreakthrough.map(
                  ({ challenge, username, createdAt }) => (
                    <li key={challenge}>
                      {`${username} solved "${challenge}" (${
                        challsScore[challenge].score
                      } pts) at ${createdAt.toLocaleTimeString()}`}
                    </li>
                  ),
                )}
              </Box>
            )}
          </Section>
        )}
      </AnimatePresence>
    </Item>
  )
}

const StyledReorderGroup = styled(
  Reorder.Group,
  cleanStyledSystemOnly(StyledBoxComposed),
)<BoxProps>(StyledBoxComposed)

const Item = styled(
  Reorder.Item,
  cleanStyledSystemOnly(StyledBoxComposed),
)<BoxProps>(
  StyledBoxComposed,
  css`
    cursor: pointer;
  `,
)

const Section = styled(
  motion.section,
  cleanStyledSystemOnly(StyledBoxComposed),
)<BoxProps>(StyledBoxComposed)
