import { PrismaCheckInRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { PrismaGymRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CheckInUseCase } from '../check-in'

export function makeCheckInUseCase() {
  const checkInsRepository = new PrismaCheckInRepository()
  const gymsRepository = new PrismaGymRepository()

  const useCase = new CheckInUseCase(checkInsRepository, gymsRepository)

  return useCase
}