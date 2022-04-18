import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { useGame } from 'hooks/useGame'
import { usePlayer } from 'hooks/usePlayer'
import { Challenge } from 'models/Challenge'
import { Fragment, useEffect, useState } from 'react'
import { display, DisplayProps, space, SpaceProps } from 'styled-system'
import { cleanStyledSystem, gap, GapProps } from 'styles'
import { ChallDescriptionPopup } from './components/ChallDescriptionPopup'
import { ChallengeCard } from './components/ChallengeCard'
import {
  getGroup,
  GroupBySelector,
  GroupByType,
} from './components/GroupBySelector'
import { Messages } from './components/Messages'

export function Game () {
  const {
    challenges,
    score: { challsScore: challScore },
    messages,
  } = useGame()

  const { myScore, myTeamScore, myTeamName } = usePlayer()

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
    <Grid display={['flex', 'grid']} gap={[1, 4]}>
      <Box
        gridArea="u-score"
        fontSize="3"
        mt={[2, 4]}
        placeSelf="center"
        as="span"
      >
        Your Score: {myScore}
      </Box>
      <Box
        gridArea="t-score"
        fontSize="3"
        mt={[2, 4]}
        placeSelf="center"
        as="span"
      >
        Team Score: {myTeamScore}
      </Box>

      <GroupBySelector
        gridArea="groupby"
        value={groupBy}
        onChange={setGroupBy}
      />

      <Box
        gridArea="challs"
        display="flex"
        flexWrap="wrap"
        alignContent="flex-start"
        justifyContent="space-evenly"
        gap="2"
      >
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
                currentTeam={myTeamName}
                onClick={() => setSelectedChall(c)}
              />
            ))}
          </Fragment>
        ))}
      </Box>

      <Box
        gridArea="message"
        display="flex"
        flexDirection="column"
        backgroundColor="background"
        p="2"
        as="aside"
      >
        <Box as="h2" fontSize="2">
          Message from Staff
        </Box>

        <Messages messages={messages} />
      </Box>

      {selectedChall && (
        <ChallDescriptionPopup
          challenge={selectedChall}
          score={challScore[selectedChall.name]}
          messages={messages.filter(m => m.challenge === selectedChall.name)}
          onClose={() => setSelectedChall(undefined)}
        />
      )}
    </Grid>
  )
}

const GroupTitle = styled.h2<SpaceProps>`
  font-size: ${p => p.theme.fontSizes[3]};
  width: 100%;
  ${space}
`

const Grid = styled('div', cleanStyledSystem)<DisplayProps & GapProps>`
  ${display}
  ${gap}
  grid-template-areas:
    't-score  u-score  message'
    'groupby  groupby  message'
    'challs   challs   message';
  grid-template-columns: 2fr 2fr minmax(25rem, 1fr);

  flex-direction: column;
`
Grid.defaultProps = {
  display: 'grid',
  gap: 4,
}
