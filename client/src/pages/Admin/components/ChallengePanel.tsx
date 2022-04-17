import { Button } from 'components/Button'
import { CategoryImg } from 'components/CategoryImg'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { Challenge } from 'models/Challenge'
import { useState } from 'react'
import { ChallengeForm } from './ChallengeForm'
import { Table, Tr, Image, ActionPanel } from './styled'

export function ChallengePanel () {
  const [openEdit, setOpenEdit] = useState<boolean>(false)
  const { challenges } = useGame()
  const { brokeChallenge, repairChallenge } = useAdmin()
  const [challToEdit, setChallToEdit] = useState<Challenge>()

  return (
    <Table m="2">
      <thead>
        <tr>
          <th scope="col">
            <Button onClick={() => setOpenEdit(true)}>Create challenge</Button>
          </th>
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
              {!c.img && <CategoryImg category={c.category} size={[2, 3]} />}
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
      {openEdit && (
        <ChallengeForm
          chall={challToEdit}
          onClose={() => {
            setOpenEdit(false)
            setChallToEdit(undefined)
          }}
        />
      )}
    </Table>
  )
}
