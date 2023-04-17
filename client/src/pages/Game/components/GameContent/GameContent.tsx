import React, { useEffect, useState } from 'react'
import { Box, Flex, ScrollArea, Space, Text, Title } from '@mantine/core'
import { getGroup, GroupBySelector, GroupByType } from '../GroupBySelector'
import { Challenge } from '../../../../models/Challenge'
import { useGame } from '../../../../hooks/useGame'
import { usePlayer } from '../../../../hooks/usePlayer'
import ChallengeList from '../ChallengeList'

const GameContent = () => {
  const {
    challenges,
    score: { challsScore: challScore },
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
    <Box sx={() => ({ flexGrow: 1 })} p="md">
      <Box
        p="xl"
        sx={theme => ({
          borderRadius: theme.radius.lg,
          backgroundColor: theme.white,
          boxShadow: theme.shadows.xl,
        })}>
          <Flex px="xs" justify="space-around">
            <Title order={2}>Your Score: {myScore}</Title>
            <Title order={2}>Team Score: {myTeamScore}</Title>
          </Flex>
          <Space h="xl" />
          <Space h="xl" />
        <Title color="customPink.0">Challenges</Title>
          <Space h="xl" />
          <GroupBySelector
            gridArea="groupby"
            value={groupBy}
            onChange={setGroupBy}
          />
        <ChallengeList groups={groups} handleClickChall={(c) => setSelectedChall(c)}/>
      </Box>
    </Box>
  )
}

export default GameContent
