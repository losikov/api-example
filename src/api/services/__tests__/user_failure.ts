import jwt, {Secret, SignCallback, SignOptions} from 'jsonwebtoken'

import cacheExternal from '@exmpl/utils/cache_external'
import db from '@exmpl/utils/db'
import {createDummy, createDummyAndAuthorize} from '@exmpl/tests/user'
import user from '../user'

jest.mock('../../../utils/cache_external.ts')

beforeAll(async () => {
  await db.open()
})

afterAll(async () => {
  await db.close()
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('auth', () => {
  it('should resolve with true and valid userId for valid token if cacheExternal rejects', async () => {
    (cacheExternal.setProp as jest.Mock).mockRejectedValue(new Error('connection error'));
    (cacheExternal.getProp as jest.Mock).mockRejectedValue(new Error('connection error'));
    const dummy = await createDummyAndAuthorize()
    await expect(user.auth(dummy.token)).resolves.toEqual({userId: dummy.userId})
  })

  it('should resolve with true and valid userId for valid token if cacheExternal rejects', async () => {
    (cacheExternal.getProp as jest.Mock).mockRejectedValue(new Error('connection error'));
    const dummy = await createDummyAndAuthorize();
    (cacheExternal.setProp as jest.Mock).mockResolvedValue({userId: dummy.userId});
    await expect(user.auth(dummy.token)).resolves.toEqual({userId: dummy.userId})
  })
})

describe('login', () => {
  it('should return internal_server_error if jwt.sign fails with the error', async () => {
    const sign = jwt.sign;
    (jwt.sign as any) = (payload: string | Buffer | object,
      secretOrPrivateKey: Secret,
      options: SignOptions,
      callback: SignCallback) => {
        callback(new Error('failure'), undefined)
    }

    const dummy = await createDummy()
    await expect(user.login(dummy.email, dummy.password)).rejects.toEqual({
      error: {type: 'internal_server_error', message: 'Internal Server Error'}
    })
    jwt.sign = sign
  })

  it('should return JWT token, userId, expireAt to a valid login/password if cacheExternal rejects', async () => {
    (cacheExternal.setProp as jest.Mock).mockRejectedValueOnce(new Error('connection error'));
    const dummy = await createDummy()
    await expect(user.login(dummy.email, dummy.password)).resolves.toEqual({
      userId: dummy.userId,
      token: expect.stringMatching(/^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/),
      expireAt: expect.any(Date)
    })
  })
})
