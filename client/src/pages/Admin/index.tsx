import styled from '@emotion/styled'
import { Box } from 'components/Box'
import { Link, Route, Routes } from 'react-router-dom'
import { fontSize, FontSizeProps, space, SpaceProps } from 'styled-system'
import { AchievementPanel } from './components/AchievementPanel'
import { ChallengePanel } from './components/ChallengePanel'
import { GeneralPanel } from './components/GeneralPanel'
import { UserPanel } from './components/UserPanel'

export function Admin () {
  return (
    <Box
      display='flex'
      flexDirection='row'
      width='100%'
    >
      <Box display='flex'
           flexDirection='column'
           justifyContent='flex-start'
           alignSelf='flex-start'
           placeContent='center'
           gap='2'
           backgroundColor='black'
           color='white'
      >
        <NavLink to=''>General</NavLink>
        <NavLink to='challenges'>Challenges</NavLink>
        <NavLink to='users'>Users</NavLink>
        <NavLink to='achievements'>Achievements</NavLink>
      </Box>

      <Box backgroundColor='white'
           width='100%'
      >
        <Routes>
          <Route path='' element={<GeneralPanel />} />
          <Route path='challenges' element={<ChallengePanel />} />
          <Route path='users' element={<UserPanel />} />
          <Route path='achievements' element={<AchievementPanel />} />
        </Routes>
      </Box>
    </Box>
  )
}

const NavLink = styled(Link)<SpaceProps & FontSizeProps & { isActive?: boolean }>`
  ${space}
  ${fontSize}
  text-decoration: ${p => p.isActive ? 'underline' : 'none'};
  color: ${p => p.theme.colors.white};
  &:hover {
    color: ${p => p.theme.colors.pink};
  }
`
NavLink.defaultProps = {
  fontSize: 3,
  px: 3,
  py: 2,
}
