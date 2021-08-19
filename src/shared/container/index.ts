import { container } from 'tsyringe'

import IMemesRepository from '@modules/memes/repositories/IMemesRepository'
import MemesRepository from '@modules/memes/infra/http/repositories/MemesRepository'

container.registerSingleton<IMemesRepository>(
  'MemesRepository',
  MemesRepository,
)
