import { FastifyInstance } from "fastify"
import request from "supertest"

export async function createAndAuthenticateUser(app: FastifyInstance) {
	await request(app.server).post("/users").send({
		name: "John",
		email: "john@gmail.com",
		password: "123456",
	})

	const tokenResponse = await request(app.server).post("/sessions").send({
		email: "john@gmail.com",
		password: "123456",
	})

	const { token } = tokenResponse.body

	return { token }
}
