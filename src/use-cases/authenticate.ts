import { UsersRepository } from "@/repositories/users-repository"
import { InvalidCredentialsError } from "./errors/invalid-credentials-error"
import { compare } from "bcryptjs"
import { User } from "@prisma/client"

interface AuthenticateUseCaseParams {
    email: string
    password: string
}

interface AuthenticateUseCaseResponse {
    user: User
}

export class AuthenticateUseCase {
    constructor(private usersRepository: UsersRepository) {}

    async call({email, password}: AuthenticateUseCaseParams): Promise<AuthenticateUseCaseResponse> {

        const user = await this.usersRepository.findByEmail(email)

        if (!user) {
            throw new InvalidCredentialsError()
        }

        const doPasswordMatches = await compare(password, user.password_hash)

        if (!doPasswordMatches) {
            throw new InvalidCredentialsError()
        }

        return {
            user
        }

    }
}