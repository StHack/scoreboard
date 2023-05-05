import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { IconLogo2023Icon } from 'components/Icon'
import { TeamScore } from 'models/GameScore'
import { SpaceProps, space } from 'styled-system'

export type TeamsScoreBoardProps = {
  score: TeamScore[]
}
export function TeamsScoreBoard ({ score }: TeamsScoreBoardProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Rank</th>
          <th>Team</th>
          <th>Score</th>
          <th>Breakthrough</th>
        </tr>
      </thead>
      {score.map(cs => (
        <tr key={cs.team}>
          <td>{cs.rank}</td>
          <td>{cs.team}</td>
          <td>{cs.score}</td>
          <Box as="td" display="flex">
            {cs.breakthroughs.map(({ username, createdAt, challenge }, i) => (
              <Box
                key={i}
                title={`${username} - ${challenge} - ${createdAt.toLocaleTimeString(
                  'fr',
                )}`}
              >
                <IconLogo2023Icon size="2" />
              </Box>
            ))}
          </Box>
        </tr>
      ))}
    </Table>
  )
}

const Table = styled.table<SpaceProps>`
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);
  ${space}

  td,
  th {
    border: 1px solid rgb(190, 190, 190);
  }

  th {
    background-color: rgb(235, 235, 235);
  }

  td {
    text-align: center;
  }

  tr:nth-of-type(even) {
    background-color: rgb(250, 250, 250);
  }

  tr:nth-of-type(odd) {
    background-color: rgb(245, 245, 245);
  }
`
