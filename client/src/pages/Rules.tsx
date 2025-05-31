import { Theme } from '@emotion/react'
import { useTheme } from '@emotion/react'
import { GameConfig } from '@sthack/scoreboard-common'
import {
  Box,
  Button,
  IconDiscord,
  IconTwitter,
  ToggleInput,
} from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { useAuth } from 'hooks/useAuthentication'
import { useGame } from 'hooks/useGame'
import ReactMarkdown from 'react-markdown'
import { useNavigate } from 'react-router-dom'

export function Rules() {
  const { gameConfig } = useGame()
  const { isAuthenticated, hasReadRules, readRules } = useAuth()
  const navigate = useNavigate()
  const {
    edition: { backgroundCredit },
  } = useTheme()

  return (
    <Box
      justifySelf="center"
      px="2"
      py="5"
      maxWidth="maximalCentered"
      gap="5"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <Box
        p="4"
        pt="1"
        borderRadius="2"
        boxShadow="small"
        backgroundColor="background"
        overflow="hidden"
      >
        <ReactMarkdown components={ReactMarkdownRenderers}>
          {rulesMarkdown(gameConfig)}
        </ReactMarkdown>

        <Box
          display="flex"
          flexDirection="row"
          pt="4"
          placeContent="space-evenly"
          gap="2"
        >
          <Button
            href="https://discord.com/invite/A4p6faRFzf"
            backgroundColor="#7289DA"
            color="#FFFFFF"
            borderColor="#7289DA"
            icon={IconDiscord}
            fontSize="0"
          >
            Discord
          </Button>
          <Button
            href="https://twitter.com/sth4ck"
            backgroundColor="#000"
            color="#FFF"
            borderColor="#000"
            icon={IconTwitter}
            fontSize="0"
          >
            Follow @sth4ck
          </Button>
        </Box>

        {isAuthenticated && (
          <Box display="grid" placeContent="center" py="4">
            <ToggleInput
              checked={hasReadRules}
              onChange={async () => {
                readRules()
                await navigate('/game')
              }}
              disabled={hasReadRules}
            >
              I confirm that I have read and accepted the CTF rules
            </ToggleInput>
          </Box>
        )}
      </Box>

      <Box
        p="4"
        pt="1"
        borderRadius="2"
        boxShadow="small"
        backgroundColor="background"
      >
        <ReactMarkdown components={ReactMarkdownRenderers}>
          {creditsMarkdown({ backgroundCredit })}
        </ReactMarkdown>
      </Box>
    </Box>
  )
}

const rulesMarkdown = (gameConfig: GameConfig) => `
# Rules

## CTF Rules

- Team size limit is **${gameConfig.teamSize}**
- Remote players are not allowed
- Sharing flags is forbidden
- Don't attack the scoring system
- Denial of Service on our infrastructure means expulsion and adding your name to the wall of shame

> We reserve the rights to disqualify any cheating team.

## Scoring

This year the scoring is dynamic, the formula is the following:

\`\`\`text
chall_points = base_score * (total_teams - solvers)
Hack4Values_points = base_reward_h4v * total_teams
team_points = chall_point + Hack4Values_points
\`\`\`

Where:

- \`base_score\` is the constant **${gameConfig.baseChallScore}**
- \`base_reward_h4v\` is the base value of the reward acquire through the Hack4Values program (see below)
- \`total_teams\` is the total number of teams playing the CTF (Currently: **${gameConfig.teamCount}**)
- \`solvers\` is the number of teams that solved this challenge
- \`Hack4Values_points\` is bonus points for participating and reporting real vulnerabilities to the Hack4Values program (see below)

This means you should expect the challenge points and your score to:

- increase at the beginning of the CTF, when teams are registering
- decrease while people solve challenges

There is no bonus points for breakthrough.

## Hack4Values rewards

You can access the detail of the [Hack4Values program here](https://sthack.fr/hack4values)

For this year, the first 5 teams will be rewarded as follow:

1. \`base_reward_h4v = 50\` so currently it will valued to **${50 * gameConfig.teamCount}**
2. \`base_reward_h4v = 45\` so currently it will valued to **${45 * gameConfig.teamCount}**
3. \`base_reward_h4v = 40\` so currently it will valued to **${40 * gameConfig.teamCount}**
4. \`base_reward_h4v = 35\` so currently it will valued to **${35 * gameConfig.teamCount}**
5. \`base_reward_h4v = 30\` so currently it will valued to **${30 * gameConfig.teamCount}**

## Difference from 2024 edition

- Theme has been changed to **Supply chain**
- No rules has been changed !

For the full changelog, please refer to the [changelog](https://github.com/StHack/scoreboard/blob/main/CHANGELOG.md)

## Help/Questions

You can come and ask us your questions directly at the staff desk.
`

const creditsMarkdown = ({
  backgroundCredit,
}: {
  backgroundCredit?: Theme['edition']['backgroundCredit']
}) => `
# Credits

${creditToMarkdown(backgroundCredit, 'Background Image')}
- Popup Layout (Ancienne télévision vintage isolée) by [brgfx sur Freepik](https://fr.freepik.com/vecteurs-libre/ancienne-television-vintage-isolee_30700323.htm#fromView=search&page=1&position=2&uuid=bbb3428b-9004-4fa9-ab1e-4718b11c75f3)
`

function creditToMarkdown(
  credit: Theme['edition']['backgroundCredit'] | undefined,
  title: string,
) {
  return credit
    ? `- ${title} (${credit.label}) by [${credit.author}](${credit.href})`
    : ''
}
