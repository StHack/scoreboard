import {
  Box,
  ConditionalLoader,
  ConditionalLoaderProps,
  Icon,
} from '@sthack/scoreboard-ui/components'
import { PropsWithChildren } from 'react'
import { useParams } from 'react-router-dom'

type PageTitleProps = {
  title: string
  icon?: Icon
}
export function PageLoader({
  title,
  icon: Icon,
  children,
  showLoader,
  error,
}: PropsWithChildren<PageTitleProps & ConditionalLoaderProps>) {
  const { year } = useParams()
  return (
    <>
      <Box
        as="h1"
        fontSize="4"
        textAlign="center"
        backgroundColor="background"
        p="3"
        gap="3"
        display="flex"
        placeContent="center"
        borderColor="secondary"
        borderWidth="medium"
        borderStyle="solid"
        borderRadius="medium"
      >
        {Icon ? <Icon size="2" /> : undefined}
        {year ? `Edition ${year} - ${title}` : title}
      </Box>
      <ConditionalLoader showLoader={showLoader} error={error} size="10">
        {children}
      </ConditionalLoader>
    </>
  )
}
