import { Box } from './Box'
import { Button } from './Button'
import { IconDelete } from './Icon'
import { TextInput } from './TextInput'

type SearchInputProps = {
  search: string
  onChange: (value: string) => void
  placeholder: string
}
export function SearchInput ({ search, onChange, placeholder }: SearchInputProps) {
  return (
    <Box
      as="form"
      display="grid"
      gridTemplateColumns="1fr auto"
      flex="1"
      minWidth="0"
      gap="2"
    >
      <TextInput
        type="search"
        name="search-box"
        value={search ?? ''}
        onChange={e => onChange(e.target.value?.toLowerCase())}
        onFocus={e => e.target.select()}
        placeholder={placeholder}
      />
      {search && (
        <Button
          type="button"
          icon={IconDelete}
          title="Clear Search"
          onClick={() => onChange('')}
        />
      )}
    </Box>
  )
}
