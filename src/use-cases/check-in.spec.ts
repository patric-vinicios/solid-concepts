import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { CheckInUseCase } from "./check-in";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";
import { MaxDistanceError } from "./errors/max-distance-error";

let checkInRepository: InMemoryCheckInsRepository
let gymRepository: InMemoryGymsRepository
let sut: CheckInUseCase

describe("Register User Case", () => {
    beforeEach(async () => {
        checkInRepository = new InMemoryCheckInsRepository()
        gymRepository = new InMemoryGymsRepository()
        sut = new CheckInUseCase(checkInRepository, gymRepository)

        await gymRepository.create({
            id: "gym01",
            title: "Gym 1",
            description: "",
            phone: "",
            latitude: 0,
            longitude: 0
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
        ).rejects.toBeInstanceOf(MaxDistanceError)
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

    it("should not be able to check in on a distant gym", async () => {
        gymRepository.items.push({
            id: "gym02",
            title: "Gym 2",
            description: "",
            phone: "",
            latitude: new Decimal(-27.0994369),
            longitude: new Decimal(-48.6080512)
        })

        await expect(() => 
            sut.call({
                gymId: "gym02",
                userId: "user01",
                userLatitude: -27.1565942,
                userLongitude: -48.5895093
            }),
        ).rejects.toBeInstanceOf(MaxDistanceError)

    })

})
