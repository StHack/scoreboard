import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { register } from 'services/authenticate'
import { useField } from './useField'

export function useRegisterForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const navigate = useNavigate()

  const usernameField = useField<string>({
    name: 'username',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })
  const teamField = useField<string>({
    name: 'team',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })
  const passwordField = useField<string>({
    name: 'password',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })

  const reset = () => {
    usernameField.reset()
    teamField.reset()
    passwordField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const { ok, error } = await register({
      username: usernameField.inputProp.value,
      team: teamField.inputProp.value,
      password: passwordField.inputProp.value,
    })

    setIsLoading(false)

    if (ok) {
      navigate('/login')
    } else {
      setError(error)
    }
  }

  return {
    formProps: {
      onSubmitCapture: onFormSubmit,
    },
    usernameProps: usernameField.inputProp,
    teamProps: teamField.inputProp,
    passwordProps: passwordField.inputProp,
    isLoading,
    reset,
    error,
  }
}
