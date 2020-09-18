import User from '@exmpl/api/models/user'
import logger from '@exmpl/utils/logger'

async function goodbye(userId: string): Promise<{message: string}> {
  try {
    const user = await User.findById(userId)
    if (!user) {
      throw new Error(`User not found`)
    }

    return {message: `Goodbye, ${user.name}!`}
  } catch (err) {
    logger.error(`goodbye: ${err}`)
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

export default {goodbye: goodbye}
