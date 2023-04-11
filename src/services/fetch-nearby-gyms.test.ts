import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import {beforeEach, describe, expect, it} from "vitest"
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe("Fetch nearby Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new FetchNearbyGymsUseCase(gymsRepository)
	})

	it("should be able to fetch nearby gyms", async () => {

		await gymsRepository.create({
			title: "Near Gym",
			description: null,
			phone: null,
			latitude: -25.4601554,
			longitude: -49.213212,
		})

		await gymsRepository.create({
			title: "Far Gym",
			description: null,
			phone: null,
			latitude: -25.7601554,
			longitude: -49.013212,
		})

		const {gyms} = await sut.execute({
			userLatitude: -25.4601554,
			userLongitude: -49.213212,
		})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({title: "Near Gym"})
		])
	})

})