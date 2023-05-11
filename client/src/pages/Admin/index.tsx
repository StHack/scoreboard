import styled from '@emotion/styled'
import { Box } from 'components/Box'
import {
  IconAchievement,
  IconAttempt,
  IconChallenge,
  IconGame,
  IconUsers,
} from 'components/Icon'
import { NavLink, Route, Routes } from 'react-router-dom'
import {
  DisplayProps,
  FlexboxProps,
  FontSizeProps,
  SpaceProps,
  display,
  flexbox,
  fontSize,
  space,
} from 'styled-system'
import { GapProps, gap } from 'styles'
import { AchievementPanel } from './components/AchievementPanel'
import { AttemptPanel } from './components/AttemptPanel'
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
        justifyContent={['space-around', 'center']}
        gap={[1, 2]}
        overflowX="auto"
        px="1"
      >
        <Link to="" end>
          <IconGame color="currentColor" size="1.5em" />
          General
        </Link>
        <Link to="challenges">
          <IconChallenge color="currentColor" size="1.5em" />
          Challenges
        </Link>
        <Link to="users">
          <IconUsers color="currentColor" size="1.5em" />
          Users
        </Link>
        <Link to="achievements">
          <IconAchievement color="currentColor" size="1.5em" />
          Achievements
        </Link>
        <Link to="attempts">
          <IconAttempt color="currentColor" size="1.5em" />
          Attempts
        </Link>
      </Box>

      <Box display="grid" flex="1" pt="2" overflowY="auto">
        <Routes>
          <Route path="" element={<GeneralPanel />} />
          <Route path="challenges" element={<ChallengePanel />} />
          <Route path="users" element={<UserPanel />} />
          <Route path="achievements" element={<AchievementPanel />} />
          <Route path="attempts" element={<AttemptPanel />} />
        </Routes>
      </Box>
    </Box>
  )
}

const Link = styled(NavLink)<
  SpaceProps & FontSizeProps & DisplayProps & FlexboxProps & GapProps
>`
  ${space}
  ${fontSize}
  ${display}
  ${flexbox}
  ${gap}
  text-decoration: none;

  &.active {
    text-decoration: underline;
  }
`
Link.defaultProps = {
  display: 'flex',
  flexDirection: ['column', 'row'],
  alignItems: 'center',
  fontSize: [0, 2, 3],
  px: [1, 2, 3],
  py: 2,
  gap: [1, 2],
}
