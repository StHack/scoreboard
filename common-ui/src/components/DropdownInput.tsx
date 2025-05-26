import { InputHTMLAttributes, useId } from 'react'
import { TextInput } from './TextInput'

export type DropdownInputProps = InputHTMLAttributes<HTMLInputElement> & {
  predefinedValues: string[] | readonly string[]
}

export function DropdownInput({
  predefinedValues,
  ...props
}: DropdownInputProps) {
  const id = useId()

  return (
    <>
      <TextInput {...props} type="text" list={id} autoComplete="off" />

      <datalist id={id}>
        {predefinedValues.map(value => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </datalist>
    </>
  )
}
