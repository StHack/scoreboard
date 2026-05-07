import { useTheme } from '@emotion/react'
import { Challenge } from '@sthack/scoreboard-common'
import { Box, MotionBox } from '@sthack/scoreboard-ui/components'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  getGroup,
  getGroupSort,
  GroupBySelector,
  GroupByType,
} from './GroupBySelector'

export function ChallengeListPanel() {
  const {
    challenges,
    score: { challsScore: challScore },
  } = useGame()

  const { myTeamScore } = usePlayer()

  const {
    edition: { card: ChallengeCard },
  } = useTheme()

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

  return (
    <>
      <GroupBySelector
        value={groupBy}
        onChange={setGroupBy}
        gridArea="control"
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
                  <Link to={`/game/${c._id}`}>
                    <ChallengeCard
                      challenge={c}
                      score={challScore[c._id]}
                      currentTeam={myTeamScore.team}
                      size="10"
                      onClick={() => {}}
                    />
                  </Link>
                </MotionBox>
              ))}
            </MotionBox>
          ))}
      </Box>
    </>
  )
}
