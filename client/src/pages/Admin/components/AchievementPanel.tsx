import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ExportJsonButton } from 'components/ExportJsonButton'
import { useAdmin } from 'hooks/useAdmin'
import { useGame } from 'hooks/useGame'
import { ActionPanel, Table, Tr } from './styled'

export function AchievementPanel () {
  const { achievements } = useGame()
  const { deleteAchievement } = useAdmin()

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" gap="2">
        <ExportJsonButton data={achievements} filename="achievements" />
      </Box>
      <Table m="2">
        <thead>
          <tr>
            <th scope="col">Challenge</th>
            <th scope="col">Team</th>
            <th scope="col">User</th>
            <th scope="col">Date</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {achievements.map(a => (
            <Tr key={a.challenge + a.teamname}>
              <td>{a.challenge}</td>
              <td>{a.teamname}</td>
              <td>{a.username}</td>
              <td>{a.createdAt.toLocaleTimeString()}</td>
              <ActionPanel m="2">
                <Button
                  variant="danger"
                  onClick={() => {
                    if (
                      // eslint-disable-next-line no-restricted-globals
                      confirm(
                        `Are you sure to delete Achievement:\n\n${
                          a.challenge
                        }\n${a.teamname}\n${
                          a.username
                        }\n${a.createdAt.toISOString()}`,
                      )
                    ) {
                      deleteAchievement(a)
                    }
                  }}
                >
                  Delete
                </Button>
              </ActionPanel>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Box>
  )
}
