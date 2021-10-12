import styled from '@emotion/styled'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { space, SpaceProps } from 'styled-system'

export type ChallsScoreBoardProps = {
  score: Record<string, ChallengeScore>
  challenges: Challenge[]
}
export function ChallsScoreBoard ({ score, challenges }: ChallsScoreBoardProps) {
  return (
    <Table>
      <thead>
        <tr>
          <th>Challs</th>
          <th>Score</th>
        </tr>
      </thead>
      {challenges.map(c => (
        <tr key={c.name}>
          <td>{c.name}</td>
          <td>{score[c.name].score}</td>
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
