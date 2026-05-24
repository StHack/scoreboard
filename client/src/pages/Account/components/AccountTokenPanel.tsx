import { Token, TokenType } from '@sthack/scoreboard-common'
import { BoxPanel } from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { usePlayer } from 'hooks/usePlayer'
import ReactMarkdown from 'react-markdown'

export function AccountTokenPanel() {
  const { myTokens } = usePlayer()

  return (
    <BoxPanel title="Your challenge tokens">
      {}
      <ReactMarkdown components={ReactMarkdownRenderers}>
        {myTokens
          .filter(t => t.type !== TokenType.teamId)
          .map(tokenToMarkdown)
          .join('\n')}
      </ReactMarkdown>
    </BoxPanel>
  )
}

const tokenToMarkdown = (token: Token) => `
### ${token.challenge.name}

To use this token, please refers you to the challenge description when the game will be opened. It will contains instructions on how to use it.

\`${token.value}\`
`
