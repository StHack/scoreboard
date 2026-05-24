import {
  Challenge,
  ChallengeToken,
  TokenType,
  TokenTypeLabels,
} from '@sthack/scoreboard-common'
import { Box, Button, IconToken, Popup } from '@sthack/scoreboard-ui/components'
import { ReactMarkdownRenderers } from '@sthack/scoreboard-ui/styles'
import { useState } from 'react'
import ReactMarkdown from 'react-markdown'

type TokenPopupProps = {
  challenge?: Challenge
  tokenType?: TokenType
  alwaysShowButton?: boolean
  iconOnly?: boolean
}

export function TokenPopup({
  challenge,
  tokenType,
  alwaysShowButton,
  iconOnly,
}: TokenPopupProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  if (!alwaysShowButton && !challenge?.token) {
    return null
  }

  const isNew = !challenge?.token
  const isTokenTypeChanged =
    challenge?.token?.type && tokenType && challenge.token.type !== tokenType

  const challengeId = challenge?._id || 'challengeId'
  const apiKey =
    (!isNew && !isTokenTypeChanged
      ? challenge?.token?.adminApiKey
      : undefined) || 'generated-token-value'
  const hasToken =
    !!challenge?.token?.type && challenge.token.type !== TokenType.teamId
  const currentType = tokenType || challenge?.token?.type

  const tokenTypeLabel = currentType
    ? TokenTypeLabels[currentType]
    : 'No token configured'

  const title = hasToken ? 'How to use the token?' : 'What is this?'

  return (
    <>
      <Button
        variant="primary"
        icon={IconToken}
        placeSelf="center"
        onClick={() => setIsOpen(true)}
        title={title}
      >
        {iconOnly ? '' : title}
      </Button>

      {isOpen && (
        <Popup title={title} onClose={() => setIsOpen(false)}>
          <Box display="grid" gap="2" p="2">
            <ReactMarkdown components={ReactMarkdownRenderers}>
              {request(challengeId, apiKey, tokenTypeLabel)}
            </ReactMarkdown>
          </Box>
        </Popup>
      )}
    </>
  )
}

const request = (challengeId: string, apiKey: string, tokenType: string) => `
### What is this feature?

Generally you want to use this feature when you need to generate isolated environment for each team on your challenge.

If this is the case, chose the token type that fit the most your requirement.

Then when you save the challenge, a new token will be generated for each team registered in the platform and will be displayed alongside the challenge description.

After that, you'll need to use the API endpoint to retrieve the generated tokens for each team.

> NB: remember that the team list is not fixed, and new team can registered at any time, so you should not cache it nor the generated tokens.

> NB2: a dedicated Admin API Key is generated per challenge and is rotated each time you change the token type.

> NB3: that Admin API Key cannot be used between different challenges too.

> NB4: Make sure to keep it safe as it can be used to retrieve all the generated tokens, So if the user retrieve it they will be able to impersonate any team on this challenge.

### Your Admin API Key

${apiKey === 'generated-token-value' ? 'A new token will be generated on save' : 'This is the API key associated with this challenge token configuration, you can use it to retrieve the generated tokens for each team using the API request below.'}

- API Key: \`${apiKey}\`
- Token Type: \`${tokenType}\`

### API Request

To retrieve the details of the generated tokens, you can use the following API request:

- http:

\`\`\`http
GET ${window.location.origin}/api/admin/challenges/${challengeId}/team-tokens
X-API-Key: ${apiKey}
\`\`\`

- curl:

\`\`\`bash
curl --request GET \\
  --url ${window.location.origin}/api/admin/challenges/${challengeId}/team-tokens \\
  --header 'x-api-key: ${apiKey}'
\`\`\`

- JavaScript (fetch):

\`\`\`javascript
fetch('${window.location.origin}/api/admin/challenges/${challengeId}/team-tokens', {
  method: 'GET',
  headers: {
    'X-API-Key': '${apiKey}',
  },
})
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));
\`\`\`

### API Response

The response will contain the list of generated tokens for each team, along with their values and types. Make sure to keep these tokens secure, as they are required for teams to access the challenge.

The possible response will look like this:

- 400 Bad Request: This challenge has no team token configured or invalid challenge id
- 401 Unauthorized: Missing API key
- 403 Forbidden: Invalid API key
- 404 Not Found: Challenge not found
- 200 OK: A JSON object containing the list of generated tokens for each team, along with their values and types.

\`\`\`json
{
  "challengeId": "xyz123",
  "challengeName": "The Challenge Name",
  "tokenType": "uuid-v4",
  "tokens": [
    {
      "teamId": "XXXX",
      "teamName": "The team X",
      "value": "generated-token-value"
    }
  ]
}
\`\`\`
`
