import {
  BaseChallenge,
  Category,
  Challenge,
  Difficulty,
  FlagPattern,
} from '@sthack/scoreboard-common'
import { useField } from '@sthack/scoreboard-ui/hooks'
import { FormEvent, useState } from 'react'
import { useAdmin } from './useAdmin'
import { useAuth } from './useAuthentication'

export function useChallengeForm(
  chall: Challenge | undefined,
  onSuccess: () => void,
) {
  const isNewChallenge = chall === undefined
  const [isLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { createChallenge, updateChallenge } = useAdmin()
  const { user: { username } = {} } = useAuth()

  const {
    _id,
    author,
    category,
    description,
    difficulty,
    img,
    isBroken,
    name,
    flagPattern,
  } = chall || {}

  const draftKeyPrefix = `draft-challenge-${isNewChallenge ? 'new' : _id}`

  const nameField = useField<string>({
    draftKeyPrefix,
    name: 'name',
    defaultValue: name ?? '',
    disabled: isLoading,
    required: true,
  })

  const authorField = useField<string>({
    draftKeyPrefix,
    name: 'author',
    defaultValue: author ?? username ?? '',
    disabled: isLoading,
    required: true,
  })
  const categoryField = useField<Category>({
    draftKeyPrefix,
    name: 'category',
    defaultValue: category ?? 'web',
    disabled: isLoading,
    required: true,
  })
  const descriptionField = useField<string>({
    draftKeyPrefix,
    name: 'description',
    defaultValue: description ?? '',
    disabled: isLoading,
    required: true,
  })

  const difficultyField = useField<Difficulty>({
    draftKeyPrefix,
    name: 'difficulty',
    defaultValue: difficulty ?? 'medium',
    disabled: isLoading,
    required: true,
  })

  const flagsField = useField<string>({
    name: 'flag',
    defaultValue: '',
    disabled: isLoading,
    required: isNewChallenge,
  })

  const flagPatternField = useField<string>({
    name: 'flag',
    defaultValue: flagPattern ?? FlagPattern.standard,
    disabled: isLoading,
    required: false,
  })

  const imgField = useField<string | undefined>({
    draftKeyPrefix,
    name: 'img',
    defaultValue: img,
    disabled: isLoading,
  })

  const isBrokenField = useField<boolean | undefined>({
    draftKeyPrefix,
    name: 'isBroken',
    defaultValue: isBroken,
    disabled: isLoading,
  })

  const cleanDraft = () => {
    localStorage.removeItem(`${draftKeyPrefix}-name`)
    localStorage.removeItem(`${draftKeyPrefix}-author`)
    localStorage.removeItem(`${draftKeyPrefix}-category`)
    localStorage.removeItem(`${draftKeyPrefix}-description`)
    localStorage.removeItem(`${draftKeyPrefix}-difficulty`)
    localStorage.removeItem(`${draftKeyPrefix}-img`)
    localStorage.removeItem(`${draftKeyPrefix}-isBroken`)
    localStorage.removeItem(`${draftKeyPrefix}-flag`)
    localStorage.removeItem(`${draftKeyPrefix}-flagPattern`)
  }

  const reset = () => {
    cleanDraft()
    nameField.reset()
    authorField.reset()
    categoryField.reset()
    descriptionField.reset()
    difficultyField.reset()
    flagsField.reset()
    flagPatternField.reset()
    imgField.reset()
    isBrokenField.reset()
  }

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload: BaseChallenge = {
        name: nameField.inputProp.value,
        author: authorField.inputProp.value,
        category: categoryField.inputProp.value,
        description: descriptionField.inputProp.value,
        img: imgField.inputProp.value ?? '',
        difficulty: difficultyField.inputProp.value,
        flag: flagsField.inputProp.value,
        flagPattern: flagPatternField.inputProp.value,
      }

      if (chall === undefined) {
        await createChallenge(payload)
      } else {
        await updateChallenge(chall._id, payload)
      }

      cleanDraft()
      onSuccess()
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message)
      } else if (typeof error === 'string') {
        setError(error)
      } else {
        setError(JSON.stringify(error))
      }
    }
  }

  const preview: Challenge = {
    _id: '',
    author: authorField.inputProp.value,
    category: categoryField.inputProp.value,
    description: descriptionField.inputProp.value,
    difficulty: difficultyField.inputProp.value,
    img: imgField.inputProp.value ?? '',
    isBroken: false,
    name: nameField.inputProp.value,
    flag: flagsField.inputProp.value,
    flagPattern: flagPatternField.inputProp.value,
  }

  return {
    formProps: {
      name: isNewChallenge ? 'create-challenge' : 'edit-challenge',
      onSubmitCapture: onFormSubmit,
    },
    nameProps: nameField.inputProp,
    authorProps: authorField.inputProp,
    categoryProps: categoryField.inputProp,
    descriptionProps: descriptionField.inputProp,
    difficultyProps: difficultyField.inputProp,
    imgProps: imgField.inputProp,
    flagsProps: flagsField.inputProp,
    flagPatternProps: flagPatternField.inputProp,

    isBrokenProps: isNewChallenge ? undefined : isBrokenField.inputProp,

    isNewChallenge,
    isLoading,
    isDirty:
      nameField.isDirty ||
      authorField.isDirty ||
      categoryField.isDirty ||
      descriptionField.isDirty ||
      difficultyField.isDirty ||
      imgField.isDirty ||
      flagsField.isDirty ||
      flagPatternField.isDirty ||
      isBrokenField.isDirty,
    reset,
    error,
    preview,
  }
}
