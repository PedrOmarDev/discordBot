import { container } from 'tsyringe'
import { Message, MessageOptions, User } from 'discord.js'

import GetRandomMemeImageService from '@modules/memes/services/GetRandomMemeImageService'

export default class ChannelMessagesController {
  private memeMessage = 0
  private eyeBreakSubscribers: User[] = []
  private interval: NodeJS.Timer

  public async execute(lastMessage: Message): Promise<void> {
    switch (lastMessage.content) {
      case '!meme':
        this.memeRequestFlow(lastMessage)
        break
      case '!eye':
        this.eyeBreakReminderRequestFlow(lastMessage)
        break
      case '!stop':
        this.eyeBreakReminderStopFlow(lastMessage)
        break
    }
  }

  private async memeRequestFlow(lastMessage: Message) {
    this.memeMessage++

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

  private async eyeBreakReminderRequestFlow(lastMessage: Message) {
    await this.sendYouAreSubscribeInEyeBreakMessage(lastMessage)
  }

  private async sendYouAreSubscribeInEyeBreakMessage(lastMessage: Message) {
    const checkUserExistsInEyeBreakReminder = this.eyeBreakSubscribers.find(
      user => user.id === lastMessage.author.id,
    )

    console.dir(this.eyeBreakSubscribers, { depth: null })

    if (!!checkUserExistsInEyeBreakReminder)
      lastMessage.channel.send(
        'User already subscribed in reminder! For exit send "!stop"',
      )
    else {
      this.createIntervalEyeBreak(lastMessage)

      const textMessage = `You are now subscribed to eye break reminders`

      lastMessage.channel.send(textMessage)

      this.eyeBreakSubscribers.push(lastMessage.author)
    }
  }

  private createIntervalEyeBreak(lastMessage: Message) {
    this.interval = setInterval(function () {
      lastMessage.channel
        .send('Please take an eye break now!')
        .catch(console.error)
    }, 10000)
  }

  private async eyeBreakReminderStopFlow(lastMessage: Message) {
    const findUserIndexInEyeBreakReminder = this.eyeBreakSubscribers.findIndex(
      user => user.id === lastMessage.author.id,
    )

    console.dir(this.eyeBreakSubscribers, { depth: null })

    if (findUserIndexInEyeBreakReminder !== -1)
      lastMessage.channel.send(
        'User are unsubscribed in reminder! For enter send "!eye"',
      )
    else {
      this.removeIntervalEyeBreak()

      const textMessage = `I have stopped eye reminders`

      lastMessage.channel.send(textMessage)

      this.eyeBreakSubscribers.splice(findUserIndexInEyeBreakReminder, 1)
    }
  }

  private removeIntervalEyeBreak() {
    clearInterval(this.interval)
  }
}
