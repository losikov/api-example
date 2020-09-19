import User, {IUser} from '@exmpl/api/models/user'
import cacheLocal from '@exmpl/utils/cache_local'
import logger from '@exmpl/utils/logger'

async function goodbye(userId: string): Promise<{message: string}> {
  try {
    let user: IUser | undefined | null = cacheLocal.get<IUser>(userId)
    if (!user) {
      user = await User.findById(userId)
      if (!user) {
        throw new Error(`User not found`)
      }

      cacheLocal.set(userId, user)
    }

    return {message: `Goodbye, ${user.name}!`}
  } catch (err) {
    logger.error(`goodbye: ${err}`)
    return Promise.reject({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
  }
}

export default {goodbye: goodbye}
