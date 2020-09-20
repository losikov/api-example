import cacheExternal from './utils/cache_external'
import db from '@exmpl/utils/db'
import logger from '@exmpl/utils/logger'
import {createServer} from '@exmpl/utils/server'

cacheExternal.open()
  .then(() => db.open())
  .then(() => createServer())
  .then(server => {
    server.listen(3000, () => {
      logger.info(`Listening on http://localhost:3000`)
    })
  })
  .catch(err => {
    logger.error(`Error: ${err}`)
  })
