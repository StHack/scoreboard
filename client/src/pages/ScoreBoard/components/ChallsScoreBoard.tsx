import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { ChallengeCard } from 'components/ChallengeCard'
import Popup from 'components/Popup'
import { Achievement } from 'models/Achievement'
import { Challenge } from 'models/Challenge'
import { ChallengeScore } from 'models/GameScore'
import { useState } from 'react'
import { SpaceProps, space } from 'styled-system'

export type ChallsScoreBoardProps = {
  challsScore: Record<string, ChallengeScore>
  challenges: Challenge[]
}
export function ChallsScoreBoard ({
  challsScore,
  challenges,
}: ChallsScoreBoardProps) {
  const [selectedBreakthrough, setSelectedBreakthrough] =
    useState<Achievement>()

  return (
    <Box display="flex" flexWrap="wrap" justifyContent="space-evenly" gap="2">
      {[...challenges]
        .sort(
          (c1, c2) => challsScore[c2.name].score - challsScore[c1.name].score,
        )
        .map(c => (
          <ChallengeCard
            key={c.name}
            challenge={c}
            score={challsScore[c.name]}
            currentTeam={challsScore[c.name].achievements[0]?.teamname}
            onClick={() =>
              setSelectedBreakthrough(challsScore[c.name].achievements[0])
            }
            size="6"
          />
        ))}
      {selectedBreakthrough && (
        <DetailChallPopup
          breakthrough={selectedBreakthrough}
          challScore={challsScore[selectedBreakthrough.challenge]}
          onClose={() => setSelectedBreakthrough(undefined)}
        />
      )}
    </Box>
  )
}

type DetailChallPopupProps = {
  breakthrough: Achievement
  challScore: ChallengeScore
  onClose: () => void
}
function DetailChallPopup ({
  breakthrough,
  challScore,
  onClose,
}: DetailChallPopupProps) {
  return (
    <Popup
      title={`${breakthrough.challenge} - ${challScore.score} pts`}
      onClose={onClose}
    >
      <Box as="h3" fontSize="3" textAlign="center" m="3">
        {`Breakthrough ${label(breakthrough)}`}
      </Box>
      <Table my="2">
        <thead>
          <tr>
            <th>Time</th>
            <th>Player</th>
            <th>Team</th>
          </tr>
        </thead>
        <tbody>
          {challScore.achievements.map((a, i) => (
            <tr>
              <td>{a.createdAt.toLocaleTimeString()}</td>
              <td>{a.username}</td>
              <td>{a.teamname}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Popup>
  )
}

const label = ({ username, teamname, createdAt }: Achievement) =>
  ` at ${createdAt.toLocaleTimeString()} by "${username}" of team "${teamname}"`

const Table = styled.table<SpaceProps>`
  ${space}
  table-layout: fixed;
  width: 100%;
  text-align: center;
  vertical-align: top;

  border-spacing: 1;
  border-collapse: collapse;

  thead {
    font-size: ${p => p.theme.fontSizes[3]};
  }

  tbody > tr:first-of-type {
    font-weight: ${p => p.theme.fontWeights[1]};
  }

  td,
  th {
    border-bottom: 1px solid rgb(190, 190, 190);
    padding: ${p => p.theme.space[2]} ${p => p.theme.space[1]};
  }

  th {
    background-color: rgb(235, 235, 235);
  }

  tr:nth-of-type(even) {
    background-color: rgb(250, 250, 250);
  }

  tr:nth-of-type(odd) {
    background-color: rgb(245, 245, 245);
  }
`
