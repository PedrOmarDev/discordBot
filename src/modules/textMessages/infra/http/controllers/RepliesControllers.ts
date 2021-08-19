import { Message } from 'discord.js'

export default class RepliesControllers {
  private pingMessage = 0

  public async execute(lastMessage: Message): Promise<void> {
    switch (lastMessage.content) {
      case 'ping':
        this.replyPong(lastMessage)
        break
    }
  }

  private async replyPong(lastMessage: Message) {
    this.pingMessage++

    console.log('this.pingMessage', this.pingMessage)

    if (this.pingMessage < 3) {
      lastMessage.reply('Pong!')
    } else {
      this.pingMessage = 0
      lastMessage.reply('Você não tem mais nada para fazer não? PONG!!!')
    }
  }
}
