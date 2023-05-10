import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Banner, IconLogo2023 } from 'components/Icon'
import { LabelInput } from 'components/LabelInput'
import { TextInput } from 'components/TextInput'
import { useGame } from 'hooks/useGame'
import { useLoginForm } from 'hooks/useLoginForm'
import { Link } from 'react-router-dom'

export function Login () {
  const { formProps, passwordProps, usernameProps, error, isLoading } =
    useLoginForm()
  const {
    gameConfig: { registrationOpened },
  } = useGame()

  return (
    <Box display="grid" placeItems="center" maxWidth="60rem" margin="0 auto">
      <Box display="flex" flexDirection="column" gap="2">
        <BBanner width="100%" />
        <Logo mb="2" />

        <Form {...formProps}>
          <LabelInput label="Username">
            <TextInput type="text" {...usernameProps} />
          </LabelInput>

          <LabelInput label="Password">
            <TextInput type="password" {...passwordProps} />
          </LabelInput>

          {error && (
            <Box backgroundColor="red" color="white">
              {error}
            </Box>
          )}

          <Button
            type="submit"
            fontSize="2"
            placeSelf="center"
            m="3"
            disabled={isLoading}
          >
            Login
          </Button>
        </Form>

        {registrationOpened && (
          <Link to="/register">Not registered yet ? Click here</Link>
        )}
      </Box>
    </Box>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
`

const Logo = styled(IconLogo2023)`
  filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
`

const BBanner = styled(Banner)`
  filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
`
