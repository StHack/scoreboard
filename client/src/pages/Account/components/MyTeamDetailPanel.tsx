import { BaseGameConfig, FullTeam, TeamScore } from '@sthack/scoreboard-common'
import {
  Box,
  BoxPanel,
  IconTeams,
  ScoreCard,
} from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { useGame } from 'hooks/useGame'
import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'

type MyTeamDetailPanelProps = {
  myTeam: FullTeam
  myTeamScore: TeamScore
}
export function MyTeamDetailPanel({
  myTeam,
  myTeamScore,
}: MyTeamDetailPanelProps) {
  const {
    score: { challsScore, beforeLastScorer, config },
  } = useGame()

  const markdown = useMemo(
    () => getTeamMarkdownDescription(myTeam, config),
    [config, myTeam],
  )

  return (
    <BoxPanel title={myTeam.name} titleIcon={IconTeams}>
      <Box
        display="grid"
        gridTemplateColumns="1fr 3fr"
        gap="3"
        justifyItems="center"
        alignItems="start"
      >
        <Box>
          <ReactMarkdown components={ReactMarkdownRenderers}>
            {markdown}
          </ReactMarkdown>
        </Box>

        <ScoreCard
          challsScore={challsScore}
          teamScore={myTeamScore}
          isBeforeLastScorer={myTeamScore === beforeLastScorer}
          gameConfig={config}
          showDetail
        />
      </Box>
    </BoxPanel>
  )
}
function getTeamMarkdownDescription(myTeam: FullTeam, config: BaseGameConfig) {
  const isTeamFull = myTeam.players.length >= config.teamSize

  const crewDescription = `
### Your crew (${myTeam.players.length}/${config.teamSize} players)

${myTeam.players.map(p => `- ${p.username}`).join('\n')}

${isTeamFull ? '> Your team is full!' : ''}
`

  const joinToken = `
### Join Token

To invite your friend to join your team, they should use that token: **${myTeam.joinToken}**
`

  return [crewDescription, !isTeamFull ? joinToken : '']
    .filter(Boolean)
    .join('\n\n')
}
