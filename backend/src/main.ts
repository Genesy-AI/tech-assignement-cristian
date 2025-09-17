import { createHttpServer } from './interfaces/http/server'
import { runTemporalWorker } from './worker'

async function bootstrap() {
  const app = createHttpServer()
  app.listen(4000, () => {
    console.log('Express server is running on port 4000')
  })

  runTemporalWorker().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}

bootstrap()
