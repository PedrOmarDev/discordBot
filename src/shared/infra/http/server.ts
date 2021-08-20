import 'reflect-metadata'
import 'dotenv/config'

import express, { NextFunction, Request, Response } from 'express'
import 'express-async-errors'

import '@shared/container'

import main from 'shared/main'

const app = express()

app.use(express.json())

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  console.error(err)

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
  })
})

main()

app.listen(3333, () => console.log('🚀 Server started on port 3333'))
