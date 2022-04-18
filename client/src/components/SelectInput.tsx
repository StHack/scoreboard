import { InputHTMLAttributes } from 'react'

export type SelectInputProps = InputHTMLAttributes<HTMLSelectElement> & {
  predefinedValues: string[] | readonly string[]
}

export function SelectInput ({
  predefinedValues,
  placeholder,
  ...props
}: SelectInputProps) {
  return (
    <select {...props}>
      {placeholder && (
        <option value="" disabled selected hidden>
          {placeholder}
        </option>
      )}
      {predefinedValues.map(value => (
        <option key={value} value={value}>
          {value}
        </option>
      ))}
    </select>
  )
}
