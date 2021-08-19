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
      // case '!meme':
      //   msg.channel.send("Here's your meme!")
      //   const img = await getMeme()
      //   msg.channel.send(img)
      //   break
      // case '!eye':
      //   msg.channel.send('You are now subscribed to eye reminders.')
      //   interval = setInterval(function () {
      //     msg.channel.send('Please take an eye break now!').catch(console.error)
      //     //   }, 3600000); //every hour
      //   }, 30000) // every hour
      //   break
      // case '!stop':
      //   msg.channel.send('I have stopped eye reminders.')
      //   clearInterval(interval)
      //   break
    }
  })

  client.login(process.env.CLIENT_TOKEN)
}

export default main
