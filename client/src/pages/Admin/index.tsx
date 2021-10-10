import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { CategoryImg } from 'components/CategoryImg'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { useState } from 'react'
import {
  color,
  ColorProps,
  size,
  SizeProps,
  space,
  SpaceProps,
} from 'styled-system'
import { cleanStyledSystem } from 'styles'
import { ChallengeForm } from './components/ChallengeForm'

export function Admin () {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { challenges } = useGame()
  const { brokeChallenge, repairChallenge } = useAdmin()
  const [challToEdit, setChallToEdit] = useState<Challenge>()

  return (
    <Box
      display="flex"
      flexDirection="column"
      maxWidth="maximalCentered"
      px="2"
      margin="0 auto"
      width="100%"
    >
      <Box display="flex" flexDirection="row">
        <Button onClick={() => setOpenEdit(true)}>Create</Button>
      </Box>
      <Table>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">Category</th>
            <th scope="col">Name</th>
            <th scope="col">Author</th>
            <th scope="col">Difficulty</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {challenges.map(c => (
            <Tr key={c.name} color={c.isBroken ? 'red' : ''}>
              <td>
                {c.img && <Image src={c.img} size={[2, 3]} />}
                {!c.img && <CategoryImg category={c.category} size={[2, 3]} /> }
              </td>
              <td>{c.category}</td>
              <td>{c.name}</td>
              <td>{c.author}</td>
              <td>{c.difficulty}</td>
              <ActionPanel m="2">
                {!c.isBroken && (
                  <Button onClick={() => brokeChallenge(c)}>Broke it</Button>
                )}
                {c.isBroken && (
                  <Button onClick={() => repairChallenge(c)}>Repair it</Button>
                )}
                <Button
                  onClick={() => {
                    setChallToEdit(c)
                    setOpenEdit(true)
                  }}
                >
                  Edit it
                </Button>
              </ActionPanel>
            </Tr>
          ))}
        </tbody>
      </Table>
      {openEdit && (
        <ChallengeForm
          chall={challToEdit}
          onClose={() => {
            setOpenEdit(false)
            setChallToEdit(undefined)
          }}
        />
      )}
    </Box>
  )
}

const Image = styled.img<SizeProps>`
  object-fit: contain;
  ${size}
`

const ActionPanel = styled.td<SpaceProps>`
  display: flex;

  > * {
    ${space}
  }
`

const Table = styled.table`
  border-collapse: collapse;
  border: 2px solid rgb(200, 200, 200);

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

  tr:nth-child(even) {
    background-color: rgb(250, 250, 250);
  }

  tr:nth-child(odd) {
    background-color: rgb(245, 245, 245);
  }
`

const Tr = styled('tr', cleanStyledSystem)<ColorProps>`
  ${color}
`
