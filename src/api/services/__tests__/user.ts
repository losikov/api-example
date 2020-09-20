import faker from 'faker'

import cacheExternal from '@exmpl/utils/cache_external'
import db from '@exmpl/utils/db'
import {createDummy, createDummyAndAuthorize} from '@exmpl/tests/user'
import user from '../user'


beforeAll(async () => {
  await cacheExternal.open()
  await db.open()
})

afterAll(async () => {
  await cacheExternal.close()
  await db.close()
})

if (false) it('auth perfromance test', async () => {
  const dummy = await createDummyAndAuthorize()

  const now = new Date().getTime()
  let i = 0
  do {
    i += 1
    await user.auth(`Bearer ${dummy.token!}`)
  } while (new Date().getTime() - now < 1000)

  console.log(`auth perfromance test: ${i}`)
})

describe('auth', () => {
  it('should resolve with true and valid userId for valid token', async () => {
    const dummy = await createDummyAndAuthorize()
    await expect(user.auth(dummy.token)).resolves.toEqual({userId: dummy.userId})
  })

  it('should resolve with false for invalid token', async () => {
    const response = await user.auth('invalidToken')
    expect(response).toEqual({error: {type: 'unauthorized', message: 'Authentication Failed'}})
  })
})

describe('login', () => {
  it('should return JWT token, userId, expireAt to a valid login/password', async () => {
    const dummy = await createDummy()
    await expect(user.login(dummy.email, dummy.password)).resolves.toEqual({
      userId: dummy.userId,
      token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
      expireAt: expect.any(Date)
    })
  })

  it('should reject with error if login does not exist', async () => {
    await expect(user.login(faker.internet.email(), faker.internet.password())).resolves.toEqual({
      error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}
    })
  })

  it('should reject with error if password is wrong', async () => {
    const dummy = await createDummy()
    await expect(user.login(dummy.email, faker.internet.password())).resolves.toEqual({
      error: {type: 'invalid_credentials', message: 'Invalid Login/Password'}
    })
  })
})

describe('createUser', () => {
  it('should resolve with true and valid userId', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const name = faker.name.firstName()

    await expect(user.createUser(email, password, name)).resolves.toEqual({
      userId: expect.stringMatching(/^[a-f0-9]{24}$/)
    })
  })

  it('should resolves with false & valid error if duplicate', async () => {
    const email = faker.internet.email()
    const password = faker.internet.password()
    const name = faker.name.firstName()

    await user.createUser(email, password, name)

    await expect(user.createUser(email, password, name)).resolves.toEqual({
      error: {
        type: 'account_already_exists',
        message: `${email} already exists`
      }
    })
  })

  it('should reject if invalid input', async () => {
    const email = 'invalid@em.c'
    const password = faker.internet.password()
    const name = faker.name.firstName()

    await expect(user.createUser('em@em.c', password, name)).rejects.toThrowError('validation failed')
  })
})
