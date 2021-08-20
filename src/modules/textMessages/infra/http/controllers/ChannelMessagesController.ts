import { container } from 'tsyringe'
import { Message, MessageOptions, User } from 'discord.js'

import GetRandomMemeImageService from '@modules/memes/services/GetRandomMemeImageService'
import SendChannelMessageService from '@modules/textMessages/services/SendChannelMessageService'

export default class ChannelMessagesController {
  private memeMessage = 0
  private eyeBreakSubscribers: User[] = []
  private interval: NodeJS.Timer
  private sendChannelMessageService: SendChannelMessageService

  public async execute(lastMessage: Message): Promise<void> {
    this.sendChannelMessageService = new SendChannelMessageService()

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

    this.sendChannelMessageService.execute({ lastMessage, textMessage })
  }

  private async sendRandomMeme(lastMessage: Message) {
    const getRandomMemeImage = container.resolve(GetRandomMemeImageService)

    const randomMemeImage = await getRandomMemeImage.execute()

    this.sendChannelMessageService.execute({
      lastMessage,
      textMessage: <MessageOptions>randomMemeImage,
    })

    if (this.memeMessage > 2)
      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage: ':rage: :rage: :rage:',
      })
  }

  private async eyeBreakReminderRequestFlow(lastMessage: Message) {
    const checkUserExistsInEyeBreakReminder = this.eyeBreakSubscribers.find(
      user => user.id === lastMessage.author.id,
    )

    if (!!checkUserExistsInEyeBreakReminder)
      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage:
          'User already subscribed in reminder! For exit send "!stop"',
      })
    else {
      this.createIntervalEyeBreak(lastMessage)

      const textMessage = `You are now subscribed to eye break reminders`

      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage,
      })

      this.eyeBreakSubscribers.push(lastMessage.author)
    }
  }

  private createIntervalEyeBreak(lastMessage: Message) {
    this.interval = setInterval(() => {
      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage: 'Please take an eye break now!',
      })
    }, 10000)
  }

  private async eyeBreakReminderStopFlow(lastMessage: Message) {
    const findUserIndexInEyeBreakReminder = this.eyeBreakSubscribers.findIndex(
      user => user.id === lastMessage.author.id,
    )

    if (findUserIndexInEyeBreakReminder === -1)
      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage: 'User are unsubscribed in reminder! For enter send "!eye"',
      })
    else {
      this.removeIntervalEyeBreak()

      const textMessage = `I have stopped eye reminders`

      this.sendChannelMessageService.execute({
        lastMessage,
        textMessage,
      })

      this.eyeBreakSubscribers.splice(findUserIndexInEyeBreakReminder, 1)
    }
  }

  private removeIntervalEyeBreak() {
    clearInterval(this.interval)
  }
}
