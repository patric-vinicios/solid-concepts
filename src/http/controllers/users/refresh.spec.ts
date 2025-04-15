import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Refresh Token (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to refresh a token', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456',
    })

    const authResponse = await request(app.server).post('/sessions').send({
        email: 'johndoe@example.com',
        password: '123456',
   })
   
   const cookies = authResponse.get('Set-Cookie')
   
   if (cookies && cookies.length > 0) {
     const cookieString = cookies.join('; ')
   
     const response = await request(app.server)
       .patch('/token/refresh')
       .set('Cookie', cookieString)
       .send()
   
     expect(response.status).toEqual(200)
     expect(response.body).toEqual({ token: expect.any(String) })
     expect(cookies).toEqual(
       expect.arrayContaining([expect.stringContaining('refreshToken=')]),
     )
   } else {
     throw new Error('No cookies received, unable to test token refresh')
   }
  })
})