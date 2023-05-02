import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"

describe("Create Gym (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to create a gym", async () => {
		const {token} = await createAndAuthenticateUser(app, true)

		const response = await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "JavaScript Gym",
				description: "Some description",
				phone: "41999999999",
				latitude: -25.4601554,
				longitude: -49.213212,
			})

		expect(response.statusCode).toEqual(201)
		
	})
})