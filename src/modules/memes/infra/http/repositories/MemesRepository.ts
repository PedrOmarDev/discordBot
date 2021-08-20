import axios from 'axios'

import IMemesRepository from '@modules/memes/repositories/IMemesRepository'

export default class MemesRepository implements IMemesRepository {
  public async findOne(): Promise<any> {
    const res = await axios.get('https://memeapi.pythonanywhere.com/')
    return res.data.memes[0].url
  }
}
