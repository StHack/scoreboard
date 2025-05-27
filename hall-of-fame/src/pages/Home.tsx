import styled from '@emotion/styled'
import {
  Box,
  BoxPanel,
  Icon,
  IconLogo2023,
  IconLogo2024,
  IconLogo2025,
  Link,
} from '@sthack/scoreboard-ui/components'

export function Home() {
  return (
    <Box
      width="100%"
      maxWidth="maximalCentered"
      justifySelf="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      p="4"
      gap="4"
    >
      <Box as="h2" fontSize="title" textAlign="center">
        Welcome to the Hall of Fame
      </Box>

      <BoxPanel title="Hall of Fame">
        <Box as="p" textAlign="center">
          This is a tribute to the champions of our game. Here, you can find the
          top players and their achievements.
        </Box>
        <Box as="p" textAlign="center">
          Explore the leaderboard and see who has made it to the top!
        </Box>
        <Box as="p" textAlign="center">
          <strong>Note:</strong> This is a static page. The actual game and its
          functionalities are available only during the event.
        </Box>
      </BoxPanel>

      <BoxPanel title="Previous editions">
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-around"
          gap="2"
        >
          <EditionLink year={2025} logo={IconLogo2025} />
          <EditionLink year={2024} logo={IconLogo2024} />
          <EditionLink year={2023} logo={IconLogo2023} />
        </Box>
      </BoxPanel>

      <BoxPanel title="How to Participate">
        <Box as="p" textAlign="center">
          To participate in the game, you need to register during the event
          period. Keep an eye on the official announcements for registration
          details.
        </Box>
      </BoxPanel>
    </Box>
  )
}

type EditionLinkProps = {
  year: number
  logo: Icon
}

export function EditionLink({ year, logo: Icon }: EditionLinkProps) {
  return (
    <SLink to={`/year/${year}`} flexDirection="column">
      <Icon size="13" />
      <Box as="span">{`${year}`}</Box>
    </SLink>
  )
}

const SLink = styled(Link)`
  svg {
    filter: drop-shadow(-1px 6px 3px hsl(0deg 0% 0% / 80%));
  }
`
