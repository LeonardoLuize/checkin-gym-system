import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"
import { prisma } from "@/lib/prisma"

describe("Create Check In (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to create a check-in", async () => {
		const { token } = await createAndAuthenticateUser(app)

		const gym = await prisma.gym.create({
			data: {
				title: "JavaScript Gym",
				latitude: -25.4601554,
				longitude: -49.213212,
			},
		})

		const response = await request(app.server)
			.post(`/gyms/${gym.id}/check-ins`)
			.set("Authorization", `Bearer ${token}`)
			.send({
				latitude: -25.4601554,
				longitude: -49.213212,
			})

		expect(response.statusCode).toEqual(201)
	})
})
