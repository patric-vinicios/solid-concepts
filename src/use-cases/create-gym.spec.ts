import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { expect, describe, it, beforeEach } from 'vitest'
import { CreateGymUseCase } from './create-gym'

let gymRepository: InMemoryGymsRepository
let sut: CreateGymUseCase

describe('Create Gym Use Case', () => {
  beforeEach(() => {
    gymRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymRepository)
  })

  it('should to create gym', async () => {
    const { gym } = await sut.call({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: 27.1565942,
      longitude: -48.5895093,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})