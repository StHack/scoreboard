import {
  BaseChallenge,
  Category,
  Challenge,
  Difficulty,
} from '@sthack/scoreboard-common'
import { ChangeEvent, FormEvent, useState } from 'react'
import { useAdmin } from './useAdmin'
import { useAuth } from './useAuthentication'
import { useField } from './useField'

export function useChallengeForm(
  chall: Challenge | undefined,
  onSuccess: () => void,
) {
  const isNewChallenge = chall === undefined
  const [isLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { createChallenge, updateChallenge } = useAdmin()
  const { user: { username } = {} } = useAuth()

  const { author, category, description, difficulty, img, isBroken, name } =
    chall || {}

  const nameField = useField<string>({
    name: 'name',
    defaultValue: name ?? '',
    disabled: isLoading,
    required: true,
  })

  const authorField = useField<string>({
    name: 'author',
    defaultValue: author ?? username ?? '',
    disabled: isLoading,
    required: true,
  })
  const categoryField = useField<Category>({
    name: 'category',
    defaultValue: category ?? 'web',
    disabled: isLoading,
    required: true,
  })
  const descriptionField = useField<string>({
    name: 'description',
    defaultValue: description ?? '',
    disabled: isLoading,
    required: true,
  })

  const difficultyField = useField<Difficulty>({
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

  const imgField = useField<string | undefined>({
    name: 'img',
    defaultValue: img,
    disabled: isLoading,
  })

  const isBrokenField = useField<boolean | undefined>({
    name: 'isBroken',
    defaultValue: isBroken,
    disabled: isLoading,
  })

  const reset = () => {
    nameField.reset()
    authorField.reset()
    categoryField.reset()
    descriptionField.reset()
    difficultyField.reset()
    flagsField.reset()
    imgField.reset()
    isBrokenField.reset()
  }

  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const payload: BaseChallenge = {
        author: authorField.inputProp.value,
        category: categoryField.inputProp.value,
        description: descriptionField.inputProp.value,
        img: imgField.inputProp.value ?? '',
        difficulty: difficultyField.inputProp.value,
        flag: flagsField.inputProp.value,
        name: nameField.inputProp.value,
      }

      if (chall === undefined) {
        await createChallenge(payload)
      } else {
        await updateChallenge(chall._id, payload)
      }

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
      isBrokenField.isDirty,
    reset,
    error,
    preview,
  }
}
