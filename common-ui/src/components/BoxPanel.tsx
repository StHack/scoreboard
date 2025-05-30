import { FormEventHandler, PropsWithChildren, ReactNode } from 'react'
import { Box, BoxProps } from './Box'
import { Icon } from './Icon'

type BoxPanelProps = {
  title: ReactNode
  titleIcon?: Icon
  onSubmitCapture?: FormEventHandler<HTMLDivElement | HTMLFormElement>
  titleProps?: BoxProps
}
export function BoxPanel({
  title,
  titleIcon: TitleIcon,
  children,
  onSubmitCapture,
  titleProps,
  ...props
}: PropsWithChildren<BoxPanelProps> & BoxProps) {
  return (
    <Box
      display="grid"
      gridAutoFlow="row"
      gridTemplateRows="auto 1fr"
      gap="2"
      backgroundColor="background"
      p="3"
      borderColor="secondary"
      borderWidth="medium"
      borderStyle="solid"
      borderRadius="medium"
      as={onSubmitCapture ? 'form' : 'div'}
      onSubmitCapture={onSubmitCapture}
      {...props}
    >
      <Box
        as="h2"
        fontSize="2"
        display="flex"
        alignItems="center"
        gap="2"
        {...titleProps}
      >
        {TitleIcon && <TitleIcon size="2" />}
        {title}
      </Box>
      {children}
    </Box>
  )
}
