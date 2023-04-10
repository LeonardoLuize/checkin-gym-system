import { InMemoryCheckInsRepository } from "@/repositories/in-memory-checkins-repository"
import { describe,beforeEach, expect, it, vi, afterEach } from "vitest"
import { CheckInUseCase } from "./checkin"
import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxCheckInsError } from "./errors/max-numbers-of-check-ins-error"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let 	sut: CheckInUseCase

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		gymsRepository = new InMemoryGymsRepository()
		sut = new CheckInUseCase(checkInsRepository, gymsRepository)

		vi.useFakeTimers()

		await gymsRepository.create({
			id: "gym-01",
			title: "Academia",
			description: "teste de academia",
			phone: "",
			latitude: new Decimal(-25.4601554),
			longitude: new Decimal(-49.213212),
		})
		
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to create a check-in", async () => {
		const {checkIn} = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("should not be able to check-in twice in the same day", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})

		await expect(() => sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})).rejects.toBeInstanceOf(MaxCheckInsError)
	})

	it("should be able to check-in twice in different days", async () => {
		vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})

		vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

		const {checkIn} = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})

	it("should be able to create a check-in", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "Academia",
			description: "teste de academia",
			phone: "",
			longitude: new Decimal(-25.4601554),
			latitude: new Decimal(-49.213212)
		})

		await expect(sut.execute({
			gymId: "gym-02",
			userId: "user-01",
			userLatitude: -25.3996731,
			userLongitude: -49.1628177,
		})).rejects.toBeInstanceOf(MaxDistanceError)
	})
})