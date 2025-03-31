import { FastifyRequest, FastifyReply} from "fastify"
import { z } from "zod"
import { RegisterUseCase } from "@/use-cases/register"
import { PrismaUserRepository } from "@/repositories/prisma/prisma-user-repository"

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema  = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const {name, email, password} = registerBodySchema.parse(request.body)

    try {
        const prismaUserRepository = new PrismaUserRepository()
        const registerUseCase = new RegisterUseCase(prismaUserRepository)

        await registerUseCase.call({
            name,
            email,
            password
        })

    } catch(error) {
        if(error instanceof Error) return reply.status(409).send({message: error.message})

        throw error
    }

    return reply.status(201).send()
}