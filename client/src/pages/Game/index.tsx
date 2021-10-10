import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { Fragment, useEffect, useState } from 'react'
import { space, SpaceProps } from 'styled-system'
import { ChallDescriptionPopup } from './components/ChallDescriptionPopup'
import { ChallengeCard } from './components/ChallengeCard'
import {
  getGroup,
  GroupBySelector,
  GroupByType,
} from './components/GroupBySelector'

export function Game () {
  const {
    challenges,
    score: { challScore, myScore, teamScore },
  } = useGame()

  const [groupBy, setGroupBy] = useState<GroupByType>('Category')
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
    setSelectedChall(undefined)
  }, [challenges])

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      alignContent="flex-start"
      justifyContent="space-evenly"
    >
      <Box
        width="100%"
        display="flex"
        fontSize="3"
        justifyContent="space-evenly"
        my="4"
      >
        <span>Your Score: {myScore}</span>
        <span>Team Score: {teamScore}</span>
      </Box>
      <GroupBySelector value={groupBy} onChange={setGroupBy} />
      {Object.entries(groups).map(([key, challs]) => (
        <Fragment key={key}>
          <GroupTitle m="2" mb="1">
            {key}
          </GroupTitle>
          {challs.map(c => (
            <ChallengeCard
              key={c.name}
              challenge={c}
              score={challScore[c.name]}
              onClick={() => setSelectedChall(c)}
            />
          ))}
        </Fragment>
      ))}
      {selectedChall && (
        <ChallDescriptionPopup
          challenge={selectedChall}
          score={challScore[selectedChall.name]}
          onClose={() => setSelectedChall(undefined)}
        />
      )}
    </Box>
  )
}

const GroupTitle = styled.h2<SpaceProps>`
  font-size: ${p => p.theme.fontSizes[3]};
  width: 100%;
  ${space}
`
