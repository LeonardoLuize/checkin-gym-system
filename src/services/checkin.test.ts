import { InMemoryCheckInsRepository } from "@/repositories/in-memory-checkins-repository"
import { describe,beforeEach, expect, it } from "vitest"
import { CheckInUseCase } from "./checkin"

let checkInsRepository: InMemoryCheckInsRepository
let 	sut: CheckInUseCase

describe("Check-in Use Case", () => {
	beforeEach(() => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new CheckInUseCase(checkInsRepository)
	})

	it("should be able to create a check-in", async () => {
		const {checkIn} = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
		})

		expect(checkIn.id).toEqual(expect.any(String))
	})
})