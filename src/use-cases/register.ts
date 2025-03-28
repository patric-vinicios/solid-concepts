import { prisma } from "@/lib/prisma"
import { hash } from "bcryptjs"

interface RegisterUseCase {
    name: string
    email: string
    password: string
}

export async function registerUseCase({name, email, password}: RegisterUseCase) {
    const password_hashed = await hash(password, 6)

    const userWithSameEmail = await prisma.user.findUnique({
        where: {
            email,
        }
    })

    if (userWithSameEmail) throw new Error("E-mail already exists")

    await prisma.user.create({
        data: {
            name,
            email,
            password_hash: password_hashed,
        }
    })
}