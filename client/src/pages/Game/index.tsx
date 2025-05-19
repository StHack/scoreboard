import { useTheme } from '@emotion/react'
import { Challenge } from '@sthack/scoreboard-common'
import { Box, MotionBox } from 'components/Box'
import { ChallDescriptionPopup } from 'components/ChallDescriptionPopup'
import { ChallengeCard } from 'components/ChallengeCard'
import { Messages } from 'components/Messages'
import Popup from 'components/Popup'
import { useAuth } from 'hooks/useAuthentication'
import { useGame } from 'hooks/useGame'
import { ProvidePlayer, usePlayer } from 'hooks/usePlayer'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import {
  getGroup,
  getGroupSort,
  GroupBySelector,
  GroupByType,
} from './components/GroupBySelector'

export function GameLayout() {
  const { isAuthenticated, hasReadRules } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />
  }

  if (!hasReadRules) {
    return <Navigate to="/rules" replace />
  }

  return (
    <ProvidePlayer>
      <Outlet />
    </ProvidePlayer>
  )
}

export function Game() {
  const {
    challenges,
    score: { challsScore: challScore },
    gameConfig: { gameOpened },
    messages,
  } = useGame()

  const { myScore, myTeamScore, myTeamName, myTeamRank, isBeforeLastScorer } =
    usePlayer()

  const theme = useTheme()

  const [groupBy, setGroupBy] = useState<GroupByType>('Default')
  const groups = challenges.reduce<Record<string, Challenge[]>>(
    (acc, chall) => ({
      ...acc,
      [getGroup(chall, groupBy)]: [
        ...(acc[getGroup(chall, groupBy)] ?? []),
        chall,
      ],
    }),
    {},
  )

  const [selectedChall, setSelectedChall] = useState<Challenge>()

  useEffect(() => {
    if (!challenges.find(c => c === selectedChall)) {
      setSelectedChall(undefined)
    }
  }, [challenges, selectedChall])

  return (
    <Box
      display={['flex', 'grid']}
      gridTemplateAreas={[
        null,
        `
        'score score message'
        'group group message'
        'chall chall message'
        `,
        `
        'group score message'
        'chall chall message'
        `,
      ]}
      gridTemplateRows={[null, 'auto auto 1fr', 'auto 1fr']}
      gridTemplateColumns="2fr 2fr minmax(25rem, 1fr)"
      flexDirection="column"
      p="2"
      rowGap="3"
      columnGap="4"
      overflowY={[null, 'hidden']}
    >
      <Box
        gridArea="score"
        fontSize={[2, 3]}
        mt={[2, 3]}
        py="2"
        px={[2, 4]}
        rowGap="2"
        columnGap={[0, 3]}
        placeSelf="center"
        backgroundColor={
          myTeamRank === 1 && myTeamScore > 0
            ? 'gold'
            : myTeamRank === 2 && myTeamScore > 0
              ? 'silver'
              : myTeamRank === 3 && myTeamScore > 0
                ? 'copper'
                : isBeforeLastScorer
                  ? undefined
                  : 'background'
        }
        background={
          myTeamRank > 3 && myTeamScore > 0 && isBeforeLastScorer
            ? theme.colors.beforeLastOne
            : undefined
        }
        color="primaryText"
        borderRadius="medium"
        display="grid"
        gridTemplateColumns="repeat(3, 1fr)"
        gridTemplateRows="repeat(2, 1fr)"
        gridAutoFlow="column"
        justifyItems="center"
        textAlign="center"
      >
        <span>Your score</span>
        <span>{myScore}</span>
        <span>Rank</span>
        <span>{myTeamRank}</span>
        <span>Team score</span>
        <span>{myTeamScore}</span>
      </Box>

      <GroupBySelector
        value={groupBy}
        onChange={setGroupBy}
        gridArea="group"
        alignSelf="center"
      />

      <Box
        display="grid"
        gridAutoFlow={['row', 'column']}
        gap="2"
        overflowY="auto"
        gridArea="chall"
      >
        {Object.entries(groups)
          .sort(([g1], [g2]) => getGroupSort(groupBy)(g1, g2))
          .map(([key, challs]) => (
            <MotionBox
              key={key}
              layout
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                visible: { transition: { staggerChildren: 0.07 } },
                hidden: {},
              }}
              display="flex"
              flexWrap="wrap"
              alignContent="flex-start"
              justifyContent="space-evenly"
              gap="2"
            >
              <Box
                as="h2"
                fontSize="3"
                m="2"
                mb="1"
                width="100%"
                backgroundColor="background"
              >
                {key}
              </Box>
              {challs.map(c => (
                <MotionBox
                  key={c._id}
                  layout
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                >
                  <ChallengeCard
                    challenge={c}
                    score={challScore[c._id]}
                    currentTeam={myTeamName}
                    onClick={() => setSelectedChall(c)}
                    size="10"
                  />
                </MotionBox>
              ))}
            </MotionBox>
          ))}
      </Box>

      <Messages
        title="Message from Staff"
        messages={messages}
        gridArea="message"
        borderRadius="medium"
      />

      {selectedChall &&
        (gameOpened ? (
          <ChallDescriptionPopup
            challenge={selectedChall}
            score={challScore[selectedChall._id]}
            messages={messages.filter(m => m.challengeId === selectedChall._id)}
            onClose={() => setSelectedChall(undefined)}
          />
        ) : (
          <Popup
            onClose={() => setSelectedChall(undefined)}
            title={selectedChall.name}
          >
            <Box color="red" textAlign="center" p="4" fontSize="3">
              Game is currently closed, if you want to see or test this
              challenge, go to the challenge page of the admin section and click
              on its icon to open the preview
            </Box>
          </Popup>
        ))}
    </Box>
  )
}
