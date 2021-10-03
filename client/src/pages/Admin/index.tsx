import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { ProvideAdmin } from 'hooks/useAdmin'
import { useState } from 'react'
import { CreateChallenge } from './components/CreateChallenge'

export function Admin () {
  const [create, setIsCreate] = useState<boolean>(false)
  return (
    <ProvideAdmin>
      <>
        <Box display="flex" flexDirection="column">
          <Box display="flex" flexDirection="row">
            <Button onClick={() => setIsCreate(true)}>Create</Button>
          </Box>
          <Box>{/* content */}</Box>
        </Box>
        {create && <CreateChallenge onClose={() => setIsCreate(false)} />}
      </>
    </ProvideAdmin>
  )
}
