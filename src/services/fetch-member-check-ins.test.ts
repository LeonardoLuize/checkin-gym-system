import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-checkins-repository"
import { describe,beforeEach, expect, it, vi, afterEach } from "vitest"
import { CheckInUseCase } from "./checkin"
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import { Decimal } from "@prisma/client/runtime"
import { MaxDistanceError } from "./errors/max-distance-error"
import { MaxCheckInsError } from "./errors/max-numbers-of-check-ins-error"
import { FetchCheckInsHistoryUseCase } from "./fetch-member-check-ins-history"

let checkInsRepository: InMemoryCheckInsRepository
let gymsRepository: InMemoryGymsRepository
let 	sut: FetchCheckInsHistoryUseCase

describe("Fetch Check-in History", () => {
	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository()
		sut = new FetchCheckInsHistoryUseCase(checkInsRepository)
	})

	it("should be able to fetch check-in history", async () => {

		await checkInsRepository.create({
			gym_id: "gym-01",
			user_id: "user-01"
		})

		await checkInsRepository.create({
			gym_id: "gym-02",
			user_id: "user-01"
		})

		const {checkIns} = await sut.execute({
			userId: "user-01",
			page: 1,
		})

		expect(checkIns).toHaveLength(2)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: "gym-01"}),
			expect.objectContaining({gym_id: "gym-02"}),
		])
	})

	it("should be able to fetch paginated check-in history", async () => {

		for(let i = 0; i <= 22; i++){
			await checkInsRepository.create({
				gym_id: `gym-${i}`,
				user_id: "user-01"
			})
		}

		const {checkIns} = await sut.execute({
			userId: "user-01",
			page: 2,
		})

		expect(checkIns).toHaveLength(3)
		expect(checkIns).toEqual([
			expect.objectContaining({gym_id: "gym-20"}),
			expect.objectContaining({gym_id: "gym-21"}),
			expect.objectContaining({gym_id: "gym-22"}),
		])
	})
	
})