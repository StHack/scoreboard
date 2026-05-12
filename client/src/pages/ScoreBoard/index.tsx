import { Challenge } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  ChallsScoreBoard,
  TeamsScoreBoard,
} from '@sthack/scoreboard-ui/components'
import { useGame } from 'hooks/useGame'
import { PropsWithChildren, useState } from 'react'
import { GridAreaProps } from 'styled-system'
import { DetailChallPopup } from './components/DetailChallPopup'

export function ScoreBoard() {
  const { score, challenges, gameConfig, surveys } = useGame()
  const { challsScore, teamsScore } = score
  const { isNoCompetition } = gameConfig

  const [selectedChallenge, setSelectedChallenge] = useState<Challenge>()

  const challsUnsolved =
    challenges.length -
    Object.values(challsScore).filter(cs => cs.achievements.length).length

  const teamScored = teamsScore.filter(ts => ts.score > 0).length
  const subtitle = isNoCompetition
    ? `${teamsScore.length} teams`
    : `${teamScored} scorers - ${teamsScore.length} teams`

  return (
    <Box
      display={['flex', 'grid']}
      alignItems={['stretch', 'start']}
      flexDirection={isNoCompetition ? 'column-reverse' : 'column'}
      gridTemplateColumns={isNoCompetition ? '2fr 1fr' : '3fr 1fr'}
      gridTemplateAreas={isNoCompetition ? '"chall team"' : '"team chall"'}
      gap="4"
      p="2"
    >
      <Block title="Team scoreboard" subtitle={subtitle} gridArea="team">
        <TeamsScoreBoard gameScore={score} />
      </Block>

      <Block
        title="Challenges scoreboard"
        subtitle={`${challsUnsolved} remaining from ${challenges.length}`}
        gridArea="chall"
      >
        <ChallsScoreBoard
          challsScore={challsScore}
          challenges={challenges}
          onChallengeClick={c => setSelectedChallenge(c)}
        />

        {selectedChallenge && (
          <DetailChallPopup
            challenge={selectedChallenge}
            challScore={challsScore[selectedChallenge._id]}
            surveys={surveys.filter(
              s => s.challengeId === selectedChallenge._id,
            )}
            gameConfig={gameConfig}
            onClose={() => setSelectedChallenge(undefined)}
          />
        )}
      </Block>
    </Box>
  )
}

type BlockProps = GridAreaProps & {
  title: string
  subtitle: string
}
function Block({
  title,
  subtitle,
  gridArea,
  children,
}: PropsWithChildren<BlockProps>) {
  return (
    <Box display="grid" gap="4" gridArea={gridArea}>
      <BoxPanel
        title={title}
        titleProps={{
          fontSize: 4,
          width: '100%',
        }}
        fontSize="4"
        placeSelf="center"
        justifyItems="center"
      >
        <Box as="span" display="block" fontSize="3">
          {subtitle}
        </Box>
      </BoxPanel>
      {children}
    </Box>
  )
}
