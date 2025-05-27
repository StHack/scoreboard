import { Box } from '@sthack/scoreboard-ui/components'
import { Outlet } from 'react-router-dom'

export function YearLayout() {
  return (
    <Box
      width="100%"
      maxWidth="maximalCentered"
      justifySelf="center"
      display="grid"
      gridAutoFlow="row"
      alignItems="center"
      p="4"
      gap="4"
    >
      <Outlet />
    </Box>
  )
}
