import { Message, MessageOptions } from 'discord.js'

interface IRequest {
  lastMessage: Message
  textMessage: string | MessageOptions
}

export default class SendChannelMessageService {
  public execute({ lastMessage, textMessage }: IRequest): void {
    lastMessage.channel.send(textMessage)
  }
}
