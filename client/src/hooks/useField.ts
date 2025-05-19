import { ChangeEvent, useState } from 'react'
import { useStorage } from './useStorage'

export type FieldProps<T> = {
  defaultValue: T
  name: string
  disabled: boolean
  draftKeyPrefix?: string
  required?: boolean
  valueRetriever?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => T
}

export type useFieldReturn<T> = {
  inputProp: {
    value: T
    name: string
    disabled: boolean
    required?: boolean
    onChange: (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
    ) => void
  }
  reset: () => void
  isDirty: boolean
}

export function useField<T>({
  draftKeyPrefix: formId,
  defaultValue,
  valueRetriever,
  ...props
}: FieldProps<T>) : useFieldReturn<T> {
  const [value, setValue] = formId
    // eslint-disable-next-line react-hooks/rules-of-hooks
    ? useStorage<T>(`${formId}-${props.name}`, defaultValue)
    // eslint-disable-next-line react-hooks/rules-of-hooks
    : useState<T>(defaultValue)

  const reset = () => {
    setValue(defaultValue)
  }

  return {
    inputProp: {
      value,
      ...props,
      onChange: (
        e: ChangeEvent<
          HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >,
      ) => setValue(valueRetriever ? valueRetriever(e) : (e.target.value as T)),
    },
    reset,
    isDirty: value !== defaultValue,
  }
}
