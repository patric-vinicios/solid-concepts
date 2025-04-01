import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"
import { AuthenticateUseCase } from "../authenticate"

export function makeAuthenticateUseCase() {
    const prismaUserRepository = new PrismaUserRepository()
    const authenticateUseCase = new AuthenticateUseCase(prismaUserRepository)

    return authenticateUseCase
}