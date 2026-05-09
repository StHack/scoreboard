import { ChangeEvent, useState } from 'react'
import { Box, MotionBox } from './Box'
import { Icon, Logo } from './Icon'

type RatingInputProps = {
  value?: number
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  name: string
  icon?: Icon
  label?: string
  labels?: string[]
  placeholder?: string
  max?: number
}

export function RatingInput({
  value = 0,
  onChange,
  name,
  icon: Icon = Logo,
  label,
  labels = [],
  placeholder,
  max = 5,
}: RatingInputProps) {
  const [hover, setHover] = useState<number | null>(null)
  const current = hover ?? value

  return (
    <Box
      as="fieldset"
      name={name}
      role="radiogroup"
      aria-label={label}
      tabIndex={0}
      onKeyDown={e => {
        if (!onChange) return

        if (e.key === 'ArrowRight' && value < 5) {
          onChange({
            target: { value: (current + 1).toString() },
          } as ChangeEvent<HTMLInputElement>)
        }
        if (e.key === 'ArrowLeft' && value > 1) {
          onChange({
            target: { value: (current - 1).toString() },
          } as ChangeEvent<HTMLInputElement>)
        }

        if (e.code === 'Space' || e.code === 'Enter') {
          const value = (e.target as HTMLElement)?.querySelector('input')?.value
          if (value && !isNaN(parseInt(value))) {
            onChange({ target: { value } } as ChangeEvent<HTMLInputElement>)
          }
        }
      }}
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap="2"
    >
      <Box display="flex" flexWrap="wrap" gap="3" placeContent="center">
        {[...Array(max + 1).keys()].slice(1).map(v => {
          const active = v <= current

          return (
            <MotionBox
              key={v}
              as="label"
              onMouseEnter={() => setHover(v)}
              onMouseLeave={() => setHover(null)}
              style={{
                cursor: 'pointer',
              }}
              animate={{
                scale: active ? 1.25 : 1,
                opacity: active ? 1 : 0.4,
                rotate: active ? 0 : -2,
              }}
              whileHover={{
                scale: 1.55,
                rotate: 2,
                transition: { type: 'spring', stiffness: 300, damping: 12 },
              }}
              whileTap={{
                scale: 0.9,
                transition: { duration: 0.1 },
              }}
              transition={{
                type: 'spring',
                stiffness: 250,
                damping: 18,
              }}
            >
              <input
                type="radio"
                name={name}
                value={v}
                checked={value === v}
                onChange={onChange}
                aria-label={labels[v - 1]}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: 0,
                  height: 0,
                }}
              />
              <Icon size="2" />
            </MotionBox>
          )
        })}
      </Box>

      <MotionBox
        as="span"
        key={current}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        fontSize="1"
        minHeight="1"
      >
        {labels[current - 1] ?? placeholder}
      </MotionBox>
    </Box>
  )
}
