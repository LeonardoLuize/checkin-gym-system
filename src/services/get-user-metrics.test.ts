import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository"
import { describe,beforeEach, expect, it, vi, afterEach } from "vitest"
import { GetUserMetricsUseCase } from "./get-user-metrics"

let checkInsRepository: InMemoryCheckInsRepository
let 	sut: GetUserMetricsUseCase

describe("Fetch Check-in Metrics", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new GetUserMetricsUseCase(checkInsRepository)
	})

	it("should be able to get user check-ins count", async () => {

		await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01"
		})

		await checkInsRepository.create({
			gym_id: "gym-02",
			user_id: "user-01"
		})

		const {checkInsMade} = await sut.execute({
			userId: "user-01",
		})

		expect(checkInsMade).toBe(2)
	})
	
})