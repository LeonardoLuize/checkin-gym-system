import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"

describe("Authenticate (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to authenticate", async () => {

		await request(app.server)
			.post("/users")
			.send({
				name: "John",
				email: "john@gmail.com",
				password: "123456"
			})

		const response = await request(app.server)
			.post("/sessions")
			.send({
				email: "john@gmail.com",
				password: "123456"
			})

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual(
			expect.objectContaining({token: expect.any(String)})
		)
	})
})