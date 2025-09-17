import express from 'express'
import leadsRouter from './routes/leads'

export function createHttpServer() {
  const app = express()
  app.use(express.json())

  app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    if (req.method === 'OPTIONS') {
      res.sendStatus(200)
      return
    }

    next()
  })

  app.use('/', leadsRouter)

  return app
}
