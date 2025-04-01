import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckInUseCase

describe("Register User Case", () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository()
        sut = new CheckInUseCase(checkInRepository)
    })

    it("should check in", async () => {
        const { checkIn } = await sut.call({
            gymId: "gym01",
            userId: "user01"
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

})
