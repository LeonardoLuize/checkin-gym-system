import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"

describe("Refresh Token (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to refresh a token", async () => {

		await request(app.server)
			.post("/users")
			.send({
				name: "John",
				email: "john@gmail.com",
				password: "123456"
			})

		const authReponse = await request(app.server)
			.post("/sessions")
			.send({
				email: "john@gmail.com",
				password: "123456"
			})

		const cookies = authReponse.get("Set-Cookie")

		const response = await request(app.server)
			.patch("/token/refresh")
			.set("Cookie", cookies)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body).toEqual(
			expect.objectContaining({token: expect.any(String)})
		)
		expect(response.get("Set-Cookie")).toEqual([
			expect.stringContaining("refreshToken=")
		])
	})
})