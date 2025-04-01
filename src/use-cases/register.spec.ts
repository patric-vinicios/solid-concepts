import { describe, it, expect } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

describe("Register User Case", () => {
    it("should hash the user password", async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUserCase = new RegisterUseCase(userRepository)

        const { user } = await registerUserCase.call({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password: "password123"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash the user password", async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUserCase = new RegisterUseCase(userRepository)

        const { user } = await registerUserCase.call({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password: "password123"
        })

        const isPasswordhashed = await compare('password123', user.password_hash)

        expect(isPasswordhashed).toBe(true)
    })

    it("should not register a user with the same email", async () => {
        const userRepository = new InMemoryUsersRepository()
        const registerUserCase = new RegisterUseCase(userRepository)

        const email = "luke@example.com"

        await registerUserCase.call({
            name: "Luke Skywalker",
            email,
            password: "password123"
        })

        await expect(() => 
            registerUserCase.call({
                name: "Luke Skywalker",
                email,
                password: "password123"
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
