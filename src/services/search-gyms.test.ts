import { InMemoryGymsRepository } from "@/repositories/in-memory-gyms-repository"
import {beforeEach, describe, expect, it} from "vitest"
import { SearchGymUseCase } from "./search-gyms"

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		sut = new SearchGymUseCase(gymsRepository)
	})

	it("should be able to search gyms", async () => {

		await gymsRepository.create({
			title: "Javascript Gym",
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		await gymsRepository.create({
			title: "Typescript Gym",
			description: null,
			phone: null,
			latitude: 0,
			longitude: 0,
		})

		const {gyms} = await sut.execute({query: "Javascript", page: 1})

		expect(gyms).toHaveLength(1)
		expect(gyms).toEqual([
			expect.objectContaining({title: "Javascript Gym"})
		])
	})

	it("should be able to fetch paginated gym search", async () => {

		for(let i = 0; i <= 22; i++){
			await gymsRepository.create({
				id: `gym-${i}`,
				title: `Javascript Gym ${i}`,
				description: null,
				phone: null,
				latitude: 0,
				longitude: 0,
			})
		}

		const {gyms} = await sut.execute({
			query: "Javascript",
			page: 2,
		})

		expect(gyms).toHaveLength(3)
		expect(gyms).toEqual([
			expect.objectContaining({title: "Javascript Gym 20"}),
			expect.objectContaining({title: "Javascript Gym 21"}),
			expect.objectContaining({title: "Javascript Gym 22"}),
		])
	})

})