import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let checkInRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Register User Case", () => {
    beforeEach(() => {
        checkInRepository = new InMemoryCheckInsRepository()
        gymRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInRepository, gymRepository)

        gymRepository.items.push({
            id: "gym01",
            title: "Gym 1",
            description: "",
            phone: "",
            latitude: new Decimal(0),
            longitude: new Decimal(0)
        })

        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("should check in", async () => {
        const { checkIn } = await sut.call({
            gymId: "gym01",
            userId: "user01",
            userLatitude: 0,
            userLongitude: 0
        })

        expect(checkIn.id).toEqual(expect.any(String))
    })

    it("should not check in twice in a day", async () => {
        vi.setSystemTime(new Date(2025, 1, 26, 5, 0, 0))

        await sut.call({
            gymId: "gym01",
            userId: "user01",
            userLatitude: 0,
            userLongitude: 0
        })

        await expect(() =>
            sut.call({
                gymId: "gym01",
                userId: "user01",
                userLatitude: 0,
                userLongitude: 0
            }),
        ).rejects.toBeInstanceOf(Error)
    })

    it("should check in twice in differente days", async () => {
        vi.setSystemTime(new Date(2025, 1, 26, 5, 0, 0))

        await sut.call({
            gymId: "gym01",
            userId: "user01",
            userLatitude: 0,
            userLongitude: 0
        })

        vi.setSystemTime(new Date(2025, 1, 27, 5, 0, 0))

            const { checkIn } = await sut.call({
                gymId: "gym01",
                userId: "user01",
                userLatitude: 0,
                userLongitude: 0
            })

            expect(checkIn.id).toEqual(expect.any(String))
    })

})
