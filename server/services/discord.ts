import debug from 'debug'
import { discordConfig } from 'sthack-config.js'

const logger = debug('sthack:discord')

export async function sendMessageToDiscord(message: string): Promise<void> {
  const config = discordConfig()

  if (!config) {
    logger('%s', message)
    return
  }

  const resp = await fetch(
    `https://discordapp.com/api/channels/${config.channel}/messages`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bot ${config.token}`,
        'User-Agent': 'Sthack Bot - CTF interface notifier',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        content: message,
      }),
    },
  )

  if (!resp.ok) {
    const content = await resp.text()

    logger(
      '%s\t%s\t%s\t%s',
      'Discord notif failed for message',
      `"${message}"`,
      resp.status,
      content,
    )
  }
}
