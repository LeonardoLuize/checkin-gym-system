import { InMemoryCheckInsRepository } from "@/repositories/in-memory-checkins-repository"
import { describe,beforeEach, expect, it, vi, afterEach } from "vitest"
import { CheckInUseCase } from "./checkin"
import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let 	sut: CheckInUseCase

describe("Check-in Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		vi.useFakeTimers()

		gymsRepository.items.push({
			id: "gym-01",
			title: "Academia",
			description: "teste de academia",
			phone: "",
			longitude: new Decimal(0),
			latitude: new Decimal(0)
		})
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to create a check-in", async () => {
		const {checkIn} = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("should not be able to check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		})

		await expect(() => sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		})).rejects.toBeInstanceOf(Error)
	})

	it("should be able to check-in twice in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		})

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

		const {checkIn} = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})