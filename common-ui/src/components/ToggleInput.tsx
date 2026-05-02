import styled from '@emotion/styled'
import { PropsWithChildren } from 'react'
import { fontSize, FontSizeProps, space, SpaceProps } from 'styled-system'

export type ToggleInputProps = {
  checked: boolean
  disabled?: boolean
  onChange: (value: boolean) => void
}

export function ToggleInput({
  checked,
  disabled,
  onChange,
  children,
  ...props
}: PropsWithChildren<ToggleInputProps & FontSizeProps & SpaceProps>) {
  return (
    <Label {...props}>
      <Input
        className="toggle"
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={e => onChange(e.target.checked)}
      />
      <Span className="toggle" />
      {children}
    </Label>
  )
}

const Input = styled.input`
  position: absolute;
  opacity: 0;
  width: 100%;
  height: 100%;
`

const Span = styled.span`
  --offset: 0.25em;
  --diameter: 1.8em;

  display: inline-flex;
  align-items: center;
  justify-content: space-around;
  box-sizing: content-box;
  width: calc(var(--diameter) * 2 + var(--offset) * 2);
  height: calc(var(--diameter) + var(--offset) * 2);
  border-width: ${p => p.theme.borderWidths.thin};
  border-style: solid;
  border-color: ${p => p.theme.colors.primaryText};
  position: relative;
  border-radius: 100vw;
  background-color: ${p => p.theme.colors.primary};
  transition: 250ms;

  ::before {
    content: '';
    position: absolute;
    top: 50%;
    left: var(--offset);
    box-sizing: border-box;
    width: var(--diameter);
    height: var(--diameter);
    /* border-width: ${p => p.theme.borderWidths.thin};
    border-style: solid;
    border-color: ${p => p.theme.colors.primaryText}; */
    border-radius: 50%;
    background-color: ${p => p.theme.colors.primaryText};
    transform: translate(0, -50%);
    will-change: transform;
    transition: inherit;
  }
`
const Label = styled.label`
  ${fontSize}
  ${space}
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  position: relative;
  cursor: pointer;
  gap: 1ch;

  &:focus span.toggle,
  input.toggle:focus + span.toggle {
    outline-width: ${p => p.theme.borderWidths.medium};
    outline-style: dotted;
    outline-color: ${p => p.theme.colors.primaryText};
    outline-color: -webkit-focus-ring-color;
    outline-offset: 2px;
  }

  input.toggle:focus:not(:focus-visible)
    + span.toggle
    &:focus:not(:focus-visible)
    span.toggle,
  &:focus {
    outline: 0;
  }

  &[aria-pressed='true'] span.toggle,
  input.toggle:checked + span.toggle {
    border-color: ${p => p.theme.colors.secondary};
  }

  &[aria-pressed='true'] span.toggle::before,
  input.toggle:checked + span.toggle::before {
    background-color: ${p => p.theme.colors.secondary};
    transform: translate(100%, -50%);
  }

  &[disabled] span.toggle,
  input.toggle:disabled + span.toggle {
    opacity: 0.6;
    filter: grayscale(40%);
    cursor: not-allowed;
  }
`
