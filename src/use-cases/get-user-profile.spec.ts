import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { GetUserProfileUseCase } from "./get-user-profile";
import { hash } from "bcryptjs";
import { ResourceNotFound } from "./errors/resource-not-found-error";

let userRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe("Get User Profile Use Case", () => {
    beforeEach(() => {
        userRepository = new InMemoryUsersRepository()
        sut = new GetUserProfileUseCase(userRepository)
    })

    it("should return an user by its id", async () => {
        const createdUser = await userRepository.create({
            name: "Luke Skywalker",
            email: "luke@example.com",
            password_hash: await hash("123123", 6),
        })

        const { user } = await sut.call({
            userId: createdUser.id
        })

        expect(user.id).toEqual(createdUser.id)
    })

    it("should return an error it the user does not exists", async () => {
        await expect(() =>
            sut.call({userId: "invalid-user-id"})
        ).rejects.toBeInstanceOf(ResourceNotFound)
    })
})
