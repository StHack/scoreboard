import { Box } from 'components/Box'
import ReactMarkdown from 'react-markdown'
import { ReactMarkdownRenderers } from 'styles/react-markdown'

export function Rules () {
  return (
    <Box m="auto" px="2" maxWidth="maximalCentered">
      <ReactMarkdown components={ReactMarkdownRenderers} children={rulesMarkdown} />
    </Box>
  )
}

const rulesMarkdown = `
# Rules

## CTF Rules

- Team size limit is 8
- Remote players are not allowed
- Sharing flags is forbidden
- Don't attack the scoring system
- Denial of Service on our infrastructure means expulsion and adding your name to the wall of shame

> We reserve the rights to disqualify any cheating team.

## Scoring

This year the scoring is dynamic, the formula is the following:

\`\`\`text
task_points = (base_score *base_difficulty)* (total_teams - solvers)
\`\`\`

Where:

- \`base_score\` is the constant **50**
- \`base_difficulty\` is
  - easy: **1**
  - medium: **2**
  - hard: **3**
- \`total_teams\` is the total number of teams playing the CTF
- \`solvers\` is the number of teams that solved this task

This means you should expect the task points and your score to:

- increase at the beginning of the CTF, when teams are registering
- decrease while people solve tasks

There is no bonus points for breakthrough.

## Help/Questions

You can come and ask us your questions directly at the staff desk.
Follow us on twitter at <https://twitter.com/sth4ck>
`
