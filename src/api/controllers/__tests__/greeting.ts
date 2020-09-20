import request from 'supertest'
import {Express} from 'express-serve-static-core'

import cacheExternal from '@exmpl/utils/cache_external'
import db from '@exmpl/utils/db'
import {createServer} from '@exmpl/utils/server'
import {createDummyAndAuthorize, deleteUser} from '@exmpl/tests/user'

let server: Express

beforeAll(async () => {
  await cacheExternal.open()
  await db.open()
  server = await createServer()
})

afterAll(async () => {
  await cacheExternal.close()
  await db.close()
})

describe('GET /hello', () => {
  it('should return 200 & valid response if request param list is empity', async done => {
    request(server)
      .get(`/api/v1/hello`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({'message': 'Hello, stranger!'})
        done()
      })
  })

  it('should return 200 & valid response if name param is set', async done => {
    request(server)
      .get(`/api/v1/hello?name=Test%20Name`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({'message': 'Hello, Test Name!'})
        done()
      })
  })
  
  it('should return 400 & valid error response if name param is empty', async done => {
    request(server)
      .get(`/api/v1/hello?name=`)
      .expect('Content-Type', /json/)
      .expect(400)
      .end((err, res) => {
        if (err) return done(err)
        expect(res.body).toMatchObject({'error': {
          type: 'request_validation', 
          message: expect.stringMatching(/Empty.*\'name\'/), 
          errors: expect.anything()
        }})
        done()
      })
  })
})

async function sendGoodbye(token: string) {
  return new Promise(function(resolve, reject) {
    request(server)
    .get(`/api/v1/goodbye`)
    .set('Authorization', `Bearer ${token}`)
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function(err, res) {
      if (err) return reject(err)
      resolve()
    })
  })
}

if (false) it('goodbye perfromance test', async () => {
  const dummy = await createDummyAndAuthorize()

  const now = new Date().getTime()
  let i = 0
  do {
    i += 1
    await sendGoodbye(dummy.token)
  } while (new Date().getTime() - now < 1000)

  console.log(`goodbye perfromance test: ${i}`)
})

describe('GET /goodbye', () => {
  it('should return 200 & valid response to authorization with fakeToken request', async done => {
    const dummy = await createDummyAndAuthorize()
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', `Bearer ${dummy.token}`)
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({'message': `Goodbye, ${dummy.name}!`})
        done()
      })
  })

  it('should return 500 & valid response if authenticated user was deleted', async done => {
    const dummy = await createDummyAndAuthorize()
    await deleteUser(dummy.userId)
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', `Bearer ${dummy.token}`)
      .expect('Content-Type', /json/)
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toEqual({error: {type: 'internal_server_error', message: 'Internal Server Error'}})
        done()
      })
  })

  it('should return 401 & valid eror response to invalid authorization token', async done => {
    request(server)
      .get(`/api/v1/goodbye`)
      .set('Authorization', 'Bearer invalidFakeToken')
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({error: {type: 'unauthorized', message: 'Authentication Failed'}})
        done()
      })
  })

  it('should return 401 & valid eror response if authorization header field is missed', async done => {
    request(server)
      .get(`/api/v1/goodbye`)
      .expect('Content-Type', /json/)
      .expect(401)
      .end(function(err, res) {
        if (err) return done(err)
        expect(res.body).toMatchObject({'error': {
          type: 'request_validation', 
          message: 'Authorization header required', 
          errors: expect.anything()
        }})
        done()
      })
  })
})
