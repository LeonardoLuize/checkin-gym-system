import { app } from "@/app"
import { afterAll, beforeAll, describe, expect, it } from "vitest"
import request from "supertest"
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user"
import { prisma } from "@/lib/prisma"

describe("Check-In History (E2E)", () => {
	beforeAll(async () => {
		await app.ready()
	})

	afterAll(async () => {
		await app.close()
	})

	it("Should be able to fetch a check-in history", async () => {
		const { token } = await createAndAuthenticateUser(app)

		const user = await prisma.user.findFirstOrThrow()

		const gym = await prisma.gym.create({
			data: {
				title: "JavaScript Gym",
				latitude: -25.4601554,
				longitude: -49.213212,
			},
		})

		await prisma.checkIn.createMany({
			data: [
				{
					gym_id: gym.id,
					user_id: user.id,
				},
				{
					gym_id: gym.id,
					user_id: user.id,
				},
			]
		})

		const response = await request(app.server)
			.get("/check-ins/history")
			.set("Authorization", `Bearer ${token}`)
			.send()

		expect(response.statusCode).toEqual(200)
		expect(response.body.checkIns).toEqual([
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id,
			}),
			expect.objectContaining({
				gym_id: gym.id,
				user_id: user.id,
			}),
		])
	})
})
