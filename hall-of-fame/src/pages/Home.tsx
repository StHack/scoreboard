import { Box, BoxPanel } from '@sthack/scoreboard-ui/components'
import { EditionLinks } from 'components/EditionLink'

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

      <BoxPanel
        title="Previous editions"
        color="primary"
        backgroundColor="secondary"
      >
        <Box
          display="flex"
          flexWrap="wrap"
          flexDirection="row"
          justifyContent="space-around"
          gap="2"
        >
          <EditionLinks size={['100%', '13']} />
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
