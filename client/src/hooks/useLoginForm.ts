import { ChangeEvent, useState } from 'react'
import { useAuth } from './useAuthentication'
import { useField } from './useField'

export function useLoginForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { logIn } = useAuth()

  const usernameField = useField<string>({
    name: 'username',
    defaultValue: '',
    disabled: isLoading,
  })
  const passwordField = useField<string>({
    name: 'password',
    defaultValue: '',
    disabled: isLoading,
  })

  const reset = () => {
    usernameField.reset()
    passwordField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    setIsLoading(true)

    const { error } = await logIn(
      usernameField.inputProp.value,
      passwordField.inputProp.value,
    )

    setError(error)

    setIsLoading(false)
  }

  return {
    formProps: {
      onSubmitCapture: onFormSubmit,
    },
    usernameProps: usernameField.inputProp,
    passwordProps: passwordField.inputProp,
    isLoading,
    reset,
    error,
  }
}
