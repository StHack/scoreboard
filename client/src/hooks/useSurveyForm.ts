import {
  Achievement,
  BaseSurvey,
  schemaBaseSurvey,
} from '@sthack/scoreboard-common'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { ChangeEvent, useState } from 'react'
import { usePlayer } from './usePlayer'

type useSurveyFormParams = {
  achievement: Achievement
}
export function useSurveyForm({ achievement }: useSurveyFormParams) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { sendSurvey } = usePlayer()

  const satisfactionField = useField<number>({
    name: 'satisfaction',
    defaultValue: 0,
    required: true,
    disabled: isLoading,
    valueRetriever: e => parseInt(e.target.value),
  })

  const perceivedDifficultyField = useField<number>({
    name: 'perceivedDifficulty',
    defaultValue: 0,
    required: true,
    disabled: isLoading,
    valueRetriever: e => parseInt(e.target.value),
  })

  const aiUsageField = useField<number>({
    name: 'aiUsage',
    defaultValue: 0,
    required: true,
    disabled: isLoading,
    valueRetriever: e => parseInt(e.target.value),
  })

  const feedbackField = useField<string>({
    name: 'feedback',
    defaultValue: '',
    required: false,
    disabled: isLoading,
  })

  const reset = () => {
    satisfactionField.reset()
    perceivedDifficultyField.reset()
    aiUsageField.reset()
    feedbackField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    const payload = {
      satisfaction: satisfactionField.inputProp.value,
      perceivedDifficulty: perceivedDifficultyField.inputProp.value,
      aiUsage: aiUsageField.inputProp.value,
      feedback: feedbackField.inputProp.value,
    } satisfies BaseSurvey

    const validations = schemaBaseSurvey.safeParse(payload)
    if (!validations.success) {
      setError('Please fill all the required field')
      return
    }

    setIsLoading(true)

    try {
      await sendSurvey(achievement.challengeId, payload)
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    formProps: {
      name: 'survey',
      onSubmitCapture: onFormSubmit,
    },
    satisfactionProps: satisfactionField.inputProp,
    perceivedDifficultyProps: perceivedDifficultyField.inputProp,
    aiUsageProps: aiUsageField.inputProp,
    feedbackProps: feedbackField.inputProp,
    isLoading,
    reset,
    error,
  }
}
