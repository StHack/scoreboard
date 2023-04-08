import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { NavLink, Route, Routes } from 'react-router-dom'
import { fontSize, FontSizeProps, space, SpaceProps } from 'styled-system'
import { AchievementPanel } from './components/AchievementPanel'
import { ChallengePanel } from './components/ChallengePanel'
import { GeneralPanel } from './components/GeneralPanel'
import { UserPanel } from './components/UserPanel'

export function Admin () {
  return (
    <Box
      display="flex"
      flexDirection={['column-reverse', 'column']}
      // maxWidth="maximalCentered"
      overflow="hidden"
      px="2"
      margin="0 auto"
      width="100%"
      height="100%"
    >
      <Box
        display="flex"
        flexDirection="row"
        placeContent="center"
        gap={[1, 2]}
        overflowX="auto"
        px="1"
      >
        <Link to="" end>
          General
        </Link>
        <Link to="challenges">Challenges</Link>
        <Link to="users">Users</Link>
        <Link to="achievements">Achievements</Link>
      </Box>

      <Box display="grid" flex="1" py="3" overflowY="auto">
        <Routes>
          <Route path="" element={<GeneralPanel />} />
          <Route path="challenges" element={<ChallengePanel />} />
          <Route path="users" element={<UserPanel />} />
          <Route path="achievements" element={<AchievementPanel />} />
        </Routes>
      </Box>
    </Box>
  )
}

const Link = styled(NavLink)<SpaceProps & FontSizeProps>`
  ${space}
  ${fontSize}
  text-decoration: none;

  &.active {
    text-decoration: underline;
  }
`
Link.defaultProps = {
  fontSize: 3,
  px: [1, 3],
  py: 2,
}
