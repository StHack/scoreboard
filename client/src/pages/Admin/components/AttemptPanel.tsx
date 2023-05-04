import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { useAdmin } from 'hooks/useAdmin'
import { exportAsJson } from 'services/share'
import { Table, Tr } from './styled'

export function AttemptPanel () {
  const { attempts } = useAdmin()

  return (
    <Box display="flex" flexDirection="column">
      <Box display="flex" flexDirection="row" gap="2">
        <Button
          onClick={() => {
            exportAsJson(attempts, 'attempts')
          }}
        >
          Export as JSON
        </Button>
      </Box>
      <Table m="2">
        <thead>
          <tr>
            <th scope="col">Challenge</th>
            <th scope="col">Team</th>
            <th scope="col">User</th>
            <th scope="col">Attempt</th>
            <th scope="col">Date</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((a, i) => (
            <Tr key={a._id}>
              <td>{a.challenge}</td>
              <td>{a.teamname}</td>
              <td>{a.username}</td>
              <td>{a.proposal}</td>
              <td>{a.createdAt.toLocaleTimeString()}</td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </Box>
  )
}
