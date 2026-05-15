import { useField } from '@sthack/scoreboard-ui/hooks'
import { ChangeEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from 'services/authenticate'

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
  const passwordField = useField<string>({
    name: 'password',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })

  const reset = () => {
    usernameField.reset()
    passwordField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const { ok, error } = await register({
      username: usernameField.inputProp.value,
      password: passwordField.inputProp.value,
    })

    setIsLoading(false)

    if (ok) {
      await navigate('/auth/login')
    } else {
      setError(error)
    }
  }

  return {
    formProps: {
      name: 'register',
      onSubmitCapture: onFormSubmit,
    },
    usernameProps: usernameField.inputProp,
    passwordProps: passwordField.inputProp,
    isLoading,
    reset,
    error,
  }
}
