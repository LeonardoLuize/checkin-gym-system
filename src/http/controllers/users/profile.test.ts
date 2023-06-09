import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"

describe("Profile (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to get user profile", async () => {
		const {token} = await createAndAuthenticateUser(app)

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