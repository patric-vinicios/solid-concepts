import { describe, it, expect, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let userRepository: InMemoryUsersRepository
let sut: RegisterUseCase

describe("Register User Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new RegisterUseCase(userRepository)
    })

    it("should register a user", async () => {
        const { user } = await sut.call({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password: "password123"
        })

        expect(user.id).toEqual(expect.any(String))
    })

    it("should hash the user password", async () => {
        const { user } = await sut.call({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password: "password123"
        })

        const isPasswordhashed = await compare('password123', user.password_hash)

        expect(isPasswordhashed).toBe(true)
    })

    it("should not register a user with the same email", async () => {
        const email = "luke@example.com"

        await sut.call({
            name: "Luke Skywalker",
            email,
            password: "password123"
        })

        await expect(() => 
            sut.call({
                name: "Luke Skywalker",
                email,
                password: "password123"
            }),
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    })
})
