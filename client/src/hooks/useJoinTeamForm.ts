import {
  formatZodError,
  JoinTeam,
  schemaJoinTeam,
} from '@sthack/scoreboard-common'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { ChangeEvent, useState } from 'react'
import { usePlayer } from './usePlayer'

export function useJoinTeamForm() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { joinTeam } = usePlayer()

  const joinTokenField = useField<string>({
    name: 'joinToken',
    defaultValue: '',
    required: true,
    disabled: isLoading,
  })

  const reset = () => {
    joinTokenField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      joinToken: joinTokenField.inputProp.value,
    } satisfies JoinTeam

    const validations = schemaJoinTeam.safeParse(payload)
    if (!validations.success) {
      setError(formatZodError(validations.error))
      return
    }

    setIsLoading(true)

    try {
      await joinTeam(payload)
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formProps: {
      name: 'join-team',
      onSubmitCapture: onFormSubmit,
    },
    joinTokenProps: joinTokenField.inputProp,
    isLoading,
    reset,
    error,
  }
}
