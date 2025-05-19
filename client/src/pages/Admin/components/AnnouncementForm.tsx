import { UserRole } from '@sthack/scoreboard-common'
import { BoxPanel } from 'components/BoxPanel'
import { Button } from 'components/Button'
import { SelectInput } from 'components/SelectInput'
import { TextArea } from 'components/TextInput'
import { useAdmin } from 'hooks/useAdmin'
import { useAuth } from 'hooks/useAuthentication'
import { useField } from 'hooks/useField'
import { useGame } from 'hooks/useGame'
import { GridAreaProps } from 'styled-system'

export function AnnouncementForm({ gridArea }: GridAreaProps) {
  const { challenges } = useGame()
  const { sendMessage } = useAdmin()
  const { roles } = useAuth()

  const messageInput = useField<string>({
    defaultValue: '',
    name: 'message',
    disabled: false,
    required: true,
  })

  const messageChallengeInput = useField<string>({
    defaultValue: '',
    name: 'message-challenge',
    disabled: false,
  })

  if (!roles.includes(UserRole.Announcer)) {
    return null
  }

  return (
    <BoxPanel
      gridArea={gridArea}
      title="Announcement"
      flexDirection="row"
      flexWrap="wrap"
      onSubmitCapture={e => {
        e.preventDefault()
        if (messageInput.inputProp.value) {
          sendMessage(
            messageInput.inputProp.value,
            messageChallengeInput.inputProp.value,
          )
        }
        messageInput.reset()
      }}
    >
      <TextArea
        as="textarea"
        placeholder="Broadcast a message to everyone (markdown supported)"
        flex="1"
        autoComplete="off"
        rows={5}
        {...messageInput.inputProp}
      />
      <SelectInput
        width={['100%', 'auto']}
        predefinedValues={challenges.map(c => ({
          label: c.name,
          value: c._id,
        }))}
        placeholder="or to a specific challenge"
        {...messageChallengeInput.inputProp}
      />
      <Button type="submit" flex={['100%', '0']}>
        Send
      </Button>
    </BoxPanel>
  )
}
