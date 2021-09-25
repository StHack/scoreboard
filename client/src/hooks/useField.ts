import { ChangeEvent, useState } from 'react'

export type FieldProps<T> = {
  defaultValue: T
  name: string
  disabled: boolean
}
export function useField<T> ({
  defaultValue,
  name,
  disabled,
}: FieldProps<T>) {
  const [value, setValue] = useState<T>(defaultValue)

  const reset = () => {
    setValue(defaultValue)
  }

  return {
    inputProp: {
      value,
      name,
      disabled,
      onChange: (e: ChangeEvent<HTMLInputElement>) => setValue(e.target.value as any),
    },
    reset,
  }
}
