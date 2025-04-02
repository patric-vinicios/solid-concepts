import { CheckIn } from "@prisma/client"
import { CheckInsRepository } from "@/repositories/check-ins-repository"
import { GymsRepository } from "@/repositories/gyms-repository"
import { ResourceNotFound } from "./errors/resource-not-found-error"
import { getDistanceBetweenCoordinates } from "@/utils/get-distance-between-coordenates"
import { MaxDistanceError } from "./errors/max-distance-error"

interface CheckInUseCaseParams {
    userId: string
    gymId: string
    userLatitude: number
    userLongitude: number
}

interface CheckInUseCaseResponse {
    checkIn: CheckIn
}

export class CheckInUseCase {
    constructor(
        private checkInsRepository: CheckInsRepository,
        private gymsRepository: GymsRepository
    ) {}

    async call({userId, gymId, userLatitude, userLongitude}: CheckInUseCaseParams): Promise<CheckInUseCaseResponse> {
        const MAX_DISTANCE_IN_KM = 0.1
        const gym = await this.gymsRepository.findById(gymId)

        if (!gym) throw new ResourceNotFound()

        const distance = getDistanceBetweenCoordinates(
            {latitude: userLatitude, longitude: userLongitude},
            {latitude: gym.latitude.toNumber(), longitude: gym.longitude.toNumber()}
        )

        if (distance > MAX_DISTANCE_IN_KM) throw new MaxDistanceError()
        
        const checkInOnSame = await this.checkInsRepository.findByUserIdOnDate(
            userId,
            new Date()
        )

        if (checkInOnSame) {
            throw new MaxDistanceError()
        }

        const checkIn = await this.checkInsRepository.create({
            user_id: userId,
            gym_id: gymId
        })

        return {
            checkIn
        }

    }
}