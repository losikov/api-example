/* eslint import/first: 0 */

import faker from 'faker'

import config from '@exmpl/config' // to force test to use and mock'redis' rather than 'redis-mock'

config.redisUrl = 'redis://localhost:6379'

import cacheExternal from '@exmpl/utils/cache_external'

import fst, {RedisStorageType} from '../../../__mocks__/redis_storage'

jest.mock('redis')


beforeAll(async () => {
	await cacheExternal.open()
})

afterAll(async () => {
	await cacheExternal.close()
})

afterEach(() => {
	fst.clear()
})

describe('setProp', () => {
	it('should reject with eror if redis.setex returns error', async () => {
    const uuid = faker.random.uuid()
    fst.addFailover(uuid, RedisStorageType.returnSet)
    await expect(cacheExternal.setProp(uuid, uuid, 60)).rejects.toThrowError()
  })

  it('should reject with eror if redis.setex callbacks with error', async () => {
    const uuid = faker.random.uuid()
    fst.addFailover(uuid, RedisStorageType.callbackSet)
    await expect(cacheExternal.setProp(uuid, uuid, 60)).rejects.toThrowError()
  })
})

describe('getProp', () => {
	it('should reject with eror if redis.get returns error', async () => {
    const uuid = faker.random.uuid()
    fst.addFailover(uuid, RedisStorageType.returnGet)
    await expect(cacheExternal.getProp(uuid)).rejects.toThrowError()
  })

  it('should reject with eror if redis.get callbacks with error', async () => {
    const uuid = faker.random.uuid()
    fst.addFailover(uuid, RedisStorageType.callbackGet)
    await expect(cacheExternal.getProp(uuid)).rejects.toThrowError()
  })
})

