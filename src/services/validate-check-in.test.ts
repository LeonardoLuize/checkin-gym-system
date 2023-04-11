import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository"
import { describe,beforeEach, expect, it, vi, afterEach } from "vitest"
import { LateValidationCheckInError } from "./errors/late-check-in-validation-error"
import { ResourceNotFound } from "./errors/resource-not-found"
import { ValidateCheckInUseCase } from "./validate-check-in"

let checkInsRepository: InMemoryCheckInsRepository
let 	sut: ValidateCheckInUseCase

describe("Check-in Use Case", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new ValidateCheckInUseCase(checkInsRepository)

		vi.useFakeTimers()
	})

	afterEach(() => {
		vi.useRealTimers()
	})

	it("should be able to validate a check-in", async () => {
		const checkInCreated = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		})

		const {checkIn} = await sut.execute({
			checkInId: checkInCreated.id
		})

		expect(checkIn.validated_at).toEqual(expect.any(Date))
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date))
	})

	it("should not be able to validate an inexistent check-in", async () => {
		await expect(() => sut.execute({
			checkInId: "inexistent-id"
		})).rejects.toBeInstanceOf(ResourceNotFound)
	})

	it("should not be able to validate the check-in after 20 minutes of its creation", async () => {
		vi.setSystemTime(new Date(2023, 0, 1, 13, 40))

		const checkInCreated = await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01",
		})

		const twentyOneMinutesInMs = 1000 * 60 * 21

		vi.advanceTimersByTime(twentyOneMinutesInMs)

		await expect(() => sut.execute({
			checkInId: checkInCreated.id
		})).rejects.toBeInstanceOf(LateValidationCheckInError)
	})
})