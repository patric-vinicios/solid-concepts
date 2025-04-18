import { UsersRepository } from "@/repositories/users-repository"
import { User } from "@prisma/client"
import { ResourceNotFound } from "./errors/resource-not-found-error"

interface GetUserProfileUseCaseParams {
    userId: string
}

interface GetUserProfileUseCaseResponse {
    user: User
}

export class GetUserProfileUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async call({userId}: GetUserProfileUseCaseParams): Promise<GetUserProfileUseCaseResponse> {

        const user = await this.usersRepository.findById(userId)

        if (!user) {
            throw new ResourceNotFound()
        }

        return {
            user
        }

    }
}