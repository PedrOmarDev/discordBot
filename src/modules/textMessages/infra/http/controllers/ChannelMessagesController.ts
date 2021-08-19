import { container } from 'tsyringe'
import { Message, MessageOptions } from 'discord.js'

import GetRandomMemeImageService from '@modules/memes/services/GetRandomMemeImageService'

export default class ChannelMessagesController {
  private memeMessage = 0

  public async execute(lastMessage: Message): Promise<void> {
    switch (lastMessage.content) {
      case '!meme':
        this.memeRequestFlow(lastMessage)
        break
    }
  }

  private async memeRequestFlow(lastMessage: Message) {
    this.memeMessage++

    console.log('memeMessage: ', this.memeMessage)

    this.sendHeresYourMemeMessage(lastMessage)

    await this.sendRandomMeme(lastMessage)

    if (this.memeMessage > 2) this.memeMessage = 0
  }

  private async sendHeresYourMemeMessage(lastMessage: Message) {
    let textMessage = `Here's your meme!`

    if (this.memeMessage > 2) textMessage += ` YOUR MEMEMANIC!!!`

    console.log('textMessage: ', textMessage)

    lastMessage.channel.send(textMessage)
  }

  private async sendRandomMeme(lastMessage: Message) {
    const getRandomMemeImage = container.resolve(GetRandomMemeImageService)

    const randomMemeImage = await getRandomMemeImage.execute()

    lastMessage.channel.send(<MessageOptions>randomMemeImage)

    if (this.memeMessage > 2) lastMessage.channel.send(`:rage: :rage: :rage:`)
  }
}
