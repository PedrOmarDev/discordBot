import { inject, injectable } from 'tsyringe'
import MemeImage from '../infra/http/entities/MemeImage'

import IMemesRepository from '../repositories/IMemesRepository'

@injectable()
export default class GetRandomMemeImageService {
  constructor(
    @inject('MemesRepository')
    private memesRepository: IMemesRepository,
  ) {}

  public async execute(): Promise<MemeImage> {
    const meme = await this.memesRepository.findOne()

    return meme
  }
}
