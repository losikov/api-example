import jwt, {Secret, SignCallback, SignOptions} from 'jsonwebtoken'

import db from '@exmpl/utils/db'
import {createDummy} from '@exmpl/tests/user'
import user from '../user'

beforeAll(async () => {
  await db.open()
})

afterAll(async () => {
  await db.close()
})

describe('login', () => {
  it('should return internal_server_error if jwt.sign fails with the error', async () => {
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
  })
})
