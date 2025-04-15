import { verifyJwt } from '@/http/middlewares/verify-jwt'
import { authenticate } from './authenticate'
import { refresh } from './refresh'
import { register } from './register'
import { FastifyInstance } from 'fastify'
import { profile } from './profile'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)
  app.patch('/token/refresh', refresh)

  app.get('/me', { onRequest: [verifyJwt] }, profile)
}