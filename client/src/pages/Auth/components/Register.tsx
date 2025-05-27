import styled from '@emotion/styled'
import {
  Banner,
  Box,
  Button,
  LabelInput,
  TextInput,
} from '@sthack/scoreboard-ui/components'
import { useRegisterForm } from 'hooks/useRegisterForm'

export function Register() {
  const {
    formProps,
    passwordProps,
    teamProps,
    usernameProps,
    error,
    isLoading,
  } = useRegisterForm()

  return (
    <Box
      display="grid"
      alignItems="center"
      width="100%"
      maxWidth="40rem"
      margin="0 auto"
      padding="4"
    >
      <Box display="flex" flexDirection="column">
        <Banner mb="4" width="100%" />

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
              autoComplete="new-password"
              id="new-password"
              minLength={5}
              {...passwordProps}
            />
          </LabelInput>

          <LabelInput label="Team">
            <TextInput
              type="text"
              minLength={3}
              maxLength={42}
              {...teamProps}
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
            Register
          </Button>
        </Form>
      </Box>
    </Box>
  )
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  font-size: ${p => p.theme.fontSizes[1]};
`
