import { prisma } from "@/lib/prisma"
import { PrismaUserRepository } from "@/repositories/prisma-user-repository"
import { hash } from "bcryptjs"

interface RegisterUseCase {
    name: string
    email: string
    password: string
}

export async function registerUseCase({name, email, password}: RegisterUseCase) {
    const password_hash = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (userWithSameEmail) throw new Error("E-mail already exists")

   const prismaUserRepository = new PrismaUserRepository()

   await prismaUserRepository.create({
    name,
    email,
    password_hash
   })
}