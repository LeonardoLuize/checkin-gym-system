import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"

describe("Search Gym (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to search a gym", async () => {
		const {token} = await createAndAuthenticateUser(app, true)

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "JavaScript Gym",
				description: "Some description",
				phone: "41999999999",
				latitude: -25.4601554,
				longitude: -49.213212,
			})

		await request(app.server)
			.post("/gyms")
			.set("Authorization", `Bearer ${token}`)
			.send({
				title: "TypeScript Gym",
				description: "Some description",
				phone: "41999999999",
				latitude: -25.4601554,
				longitude: -49.213212,
			})

		const response = await request(app.server)
			.get("/gyms/search")
			.query({
				q: "JavaScript"
			})
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.gyms).toHaveLength(1)
		expect(response.body.gyms).toEqual([
			expect.objectContaining({title: "JavaScript Gym"})
		])
		
	})
})