import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository"
import {beforeEach, describe, expect, it} from "vitest"
import { CreateGymCase } from "./create-gym"

let gymsRepository: InMemoryGymsRepository
let createGymUseCase: CreateGymCase

describe("Create Gym Use Case", () => {
	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository()
		createGymUseCase = new CreateGymCase(gymsRepository)
	})

	it("should be able to create a new gym", async () => {
		const {gym} = await createGymUseCase.execute({
			title: "gym 1",
			description: null,
			phone: null,
			latitude: -25.4601554,
			longitude: -49.213212,
		})

		expect(gym.id).toEqual(expect.any(String))
	})

})