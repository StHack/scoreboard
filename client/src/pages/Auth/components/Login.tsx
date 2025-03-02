import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Button } from 'components/Button'
import { Banner, IconLogo2024 } from 'components/Icon'
import { LabelInput } from 'components/LabelInput'
import { TextInput } from 'components/TextInput'
import { useGame } from 'hooks/useGame'
import { useLoginForm } from 'hooks/useLoginForm'
import { Link } from 'react-router-dom'

export function Login() {
  const { formProps, passwordProps, usernameProps, error, isLoading } =
    useLoginForm()
  const {
    gameConfig: { registrationOpened },
  } = useGame()

  return (
    <Box
      display="grid"
      alignItems="center"
      width="100%"
      maxWidth="40rem"
      margin="0 auto"
      padding="4"
    >
      <Box display="flex" flexDirection="column" gap="2">
        <BBanner width="100%" />
        <Logo mb="2" />

        <Form {...formProps}>
          <LabelInput label="Username">
            <TextInput
              type="text"
              autoComplete="username"
              minLength={3}
              maxLength={42}
              {...usernameProps}
            />
          </LabelInput>

          <LabelInput label="Password">
            <TextInput
              type="password"
              autoComplete="current-password"
              id="current-password"
              minLength={5}
              {...passwordProps}
            />
          </LabelInput>

          {error && (
            <Box backgroundColor="red" color="white" role="alert">
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
          <Link to="/auth/register">Not registered yet ? Click here</Link>
        )}
      </Box>
    </Box>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: ${p => p.theme.fontSizes[1]};
`

const Logo = styled(IconLogo2024)`
  filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
`

const BBanner = styled(Banner)`
  filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
`
