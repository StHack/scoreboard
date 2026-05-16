import {
  CreateTeam,
  formatZodError,
  schemaCreateTeam,
} from '@sthack/scoreboard-common'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { ChangeEvent, useState } from 'react'
import { usePlayer } from './usePlayer'

export function useCreateTeamForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { createTeam } = usePlayer()

  const nameField = useField<string>({
    name: 'teamname',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })

  const reset = () => {
    nameField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      name: nameField.inputProp.value,
    } satisfies CreateTeam

    const validations = schemaCreateTeam.safeParse(payload)
    if (!validations.success) {
      setError(formatZodError(validations.error))
      return
    }

    setIsLoading(true)

    try {
      await createTeam(payload)
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formProps: {
      name: 'create-team',
      onSubmitCapture: onFormSubmit,
    },
    nameProps: nameField.inputProp,
    isLoading,
    reset,
    error,
  }
}
