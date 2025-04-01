import { describe, it, expect, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let userRepository: InMemoryUsersRepository
let sut: AuthenticateUseCase

describe("Authenticate User Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new AuthenticateUseCase(userRepository)
    })

    it("should be able to authenticate", async () => {
        await userRepository.create({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password_hash: await hash("123123", 6),
        })

        const { user } = await sut.call({
            email: "luke@example.com",
            password: "123123"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should not authenticate with invalid email", async () => {
        await expect(() => 
            sut.call({
                email: "luke@example.com",
                password: "123123"
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })

    it("should not authenticate with invalid password", async () => {
        await userRepository.create({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password_hash: await hash("123123", 6),
        })

        await expect(() => 
            sut.call({
                email: "luke@example.com",
                password: "123456"
            }),
        ).rejects.toBeInstanceOf(InvalidCredentialsError)
    })
})
