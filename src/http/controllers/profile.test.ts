import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"

describe("Profile (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to get user profile", async () => {

		await request(app.server)
			.post("/users")
			.send({
				name: "John",
				email: "john@gmail.com",
				password: "123456"
			})

		const tokenResponse = await request(app.server)
			.post("/sessions")
			.send({
				email: "john@gmail.com",
				password: "123456"
			})

		const {token} = tokenResponse.body

		const response = await request(app.server)
			.get("/me")
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual({
			user: expect.objectContaining({email: "john@gmail.com"})
		})
	})
})