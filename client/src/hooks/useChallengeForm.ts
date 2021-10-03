import { ChangeEvent, useState } from 'react'
import { useField } from './useField'
import { Challenge } from 'models/Challenge'
import { Difficulty } from 'models/Difficulty'
import { useAdmin } from './useAdmin'
import { useAuth } from './useAuthentication'

export function useChallengeForm (chall: Challenge | undefined, onSuccess: () => void) {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const { createChallenge } = useAdmin()
  const { user: { username } = {} } = useAuth()

  const {
    author,
    category,
    description,
    difficulty,
    flags = [],
    img,
    isBroken,
    isOpen,
    link,
    name,
  } = chall || {}

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
  const categoryField = useField<string>({
    name: 'team',
    defaultValue: category ?? '',
    disabled: isLoading,
    required: true,
  })
  const descriptionField = useField<string>({
    name: 'description',
    defaultValue: description ?? '',
    disabled: isLoading,
    required: true,
  })

  const linkField = useField<string>({
    name: 'link',
    defaultValue: link ?? '',
    disabled: isLoading,
  })

  const difficultyField = useField<Difficulty>({
    name: 'difficulty',
    defaultValue: difficulty ?? 'medium',
    disabled: isLoading,
    required: true,
  })

  const flagsField = useField<string>({
    name: 'difficulty',
    defaultValue: '',
    disabled: isLoading,
  })

  const imgField = useField<string | undefined>({
    name: 'img',
    defaultValue: img,
    disabled: isLoading,
    required: true,
  })

  const isBrokenField = useField<boolean | undefined>({
    name: 'isBroken',
    defaultValue: isBroken,
    disabled: isLoading,
  })

  const isOpenField = useField<boolean | undefined>({
    name: 'isBroken',
    defaultValue: isOpen,
    disabled: isLoading,
  })

  const reset = () => {
    nameField.reset()
    authorField.reset()
    categoryField.reset()
    descriptionField.reset()
    linkField.reset()
    difficultyField.reset()
    isBrokenField.reset()
    isOpenField.reset()
  }

  const onFormSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      await createChallenge({
        author: authorField.inputProp.value,
        category: categoryField.inputProp.value,
        description: descriptionField.inputProp.value,
        link: linkField.inputProp.value,
        img: imgField.inputProp.value ?? '',
        difficulty: difficultyField.inputProp.value,
        flags: [flagsField.inputProp.value],
        name: nameField.inputProp.value,
      })
      onSuccess()
    } catch (error) {
      setError(error as string)
    }
  }

  return {
    formProps: {
      onSubmitCapture: onFormSubmit,
    },
    nameProps: nameField.inputProp,
    authorProps: authorField.inputProp,
    categoryProps: categoryField.inputProp,
    descriptionProps: descriptionField.inputProp,
    linkProps: linkField.inputProp,
    difficultyProps: difficultyField.inputProp,
    imgProps: imgField.inputProp,
    flagsProps: flagsField.inputProp,

    isBrokenProps: chall !== undefined ? isBrokenField.inputProp : undefined,
    isOpenProps: chall !== undefined ? isOpenField.inputProp : undefined,

    isNewChallenge: chall === undefined,
    isLoading,
    reset,
    error,
  }
}
