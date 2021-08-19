import { Client, Intents } from 'discord.js'

import RepliesController from '@modules/textMessages/infra/http/controllers/RepliesControllers'
import ChannelMessagesController from '@modules/textMessages/infra/http/controllers/ChannelMessagesController'

const main = (): void => {
  const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
  })

  const repliesController = new RepliesController()
  const channelMessagesController = new ChannelMessagesController()

  client.on('message', async msg => {
    switch (msg.content) {
      case 'ping':
        repliesController.execute(msg)
        break
      case '!meme':
        channelMessagesController.execute(msg)
        break
      case '!eye':
        channelMessagesController.execute(msg)
        break
      case '!stop':
        channelMessagesController.execute(msg)
        break
    }
  })

  client.login(process.env.CLIENT_TOKEN)
}

export default main
