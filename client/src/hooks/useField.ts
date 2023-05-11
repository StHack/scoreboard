import { ChangeEvent, useState } from 'react'

export type FieldProps<T> = {
  defaultValue: T
  name: string
  disabled: boolean
  required?: boolean
  valueRetriever?: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => T
}
export function useField<T> ({
  defaultValue,
  valueRetriever,
  ...props
}: FieldProps<T>) {
  const [value, setValue] = useState<T>(defaultValue)

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
      ) =>
        setValue(valueRetriever ? valueRetriever(e) : (e.target.value as any)),
    },
    reset,
  }
}
